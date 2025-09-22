import React, {FC, ReactNode, useEffect, useState} from "react";
import dayjs, {Dayjs} from "dayjs";
import {Button, Card, DatePicker, Divider, Modal, Popconfirm, Space, Tooltip, Typography} from "antd";
import {DeleteOutlined, ExclamationCircleOutlined, PlusOutlined} from "@ant-design/icons";
import { DateGranularity } from "../../api/value-history/DTOs/DateGranularity";
import {EntityColumnDto, EntityTableDto, ValueHistoryRecordDto} from "../../api/value-history/DTOs/EntityTableDto";
import {Column, ColumnGroup, CustomEditableColumn, ExtendableTable} from "../table/ExtendableTable";
import DateGranularityPicker from "../DateGranularityPicker";
import MoneyCharts from "../charts/custom/MoneyCharts";
import CompositionChart from "../charts/custom/CompositionChart";
import EmptyConfig from "../EmptyConfig";
import {OrderableEntityDto} from "../../api/configuration/DTOs/ConfigurationDto";
import {getPhysicalAllocations} from "../../api/configuration/Client";
import {MoneyDto} from "../../api/value-history/DTOs/Money";
import TargetChart from "../charts/custom/TargetChart";
import ScoreChart from "../charts/custom/ScoreChart";
import MoneyForm from "./MoneyForm";
import {EntityValueSnapshotDto, ValueSnapshotDto} from "../../api/value-history/DTOs/ValueSnapshotDto";
import Money from "./Money";
import TargetForm from "./TargetForm";
import ColoredPercent from "../ColoredPercent";
import InflationForm from "./InflationForm";

const {Text} = Typography;

interface EditableMoneyComponentProps {
    title: string;
    getData: (granularity?: DateGranularity, from?: Dayjs, to?: Dayjs) => Promise<EntityTableDto>;
    showInferredValues: boolean;
    showCompositionChart: boolean;
    editable?: EditableProps;
    setInflation?: (year: number, month: number, value: number, confirmed: boolean) => Promise<void>;
    allowedGranularities?: DateGranularity[];
    defaultGranularity?: DateGranularity;
}

interface EditableProps {
    onUpdate: (id: string, date: Dayjs, value: MoneyDto, physicalAllocationId?: string) => Promise<void>;
    onDelete?: (date: Dayjs) => Promise<void>;
    setTarget?: (date: Dayjs, value: number) => Promise<void>
} 

const EditableMoneyComponent: FC<EditableMoneyComponentProps> = (props: EditableMoneyComponentProps) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedDate, setSelectedDate] = useState<Dayjs | undefined>(undefined);
    const [newEntryDate, setNewEntryDate] = useState<Dayjs | undefined>(undefined);
    const [granularity, setGranularity] = useState<DateGranularity>(props.defaultGranularity ?? DateGranularity.Day);
    const [fromDate, setFromDate] = useState<Dayjs | undefined>(undefined);
    const [toDate, setToDate] = useState<Dayjs | undefined>(undefined);

    const [data, setData] = useState<EntityTableDto>({
        columns: [] as EntityColumnDto[],
        rows: [] as ValueHistoryRecordDto[]
    });

    const [physicalAllocations, setPhysicalAllocations] = useState<OrderableEntityDto[]>([]);

    const populateData = async (granularity?: DateGranularity, from?: Dayjs, to?: Dayjs) => {
        const dataResponse = await props.getData(
            granularity,
            from,
            to
        );
        
        const physicalAllocationsResponse = await getPhysicalAllocations();

        setData({
            columns: dataResponse.columns,
            rows: dataResponse.rows
        });
        
        setPhysicalAllocations(physicalAllocationsResponse);
    }

    useEffect(() => {
        populateData();
    }, []);
    
    let onUpdateCallback = async () => {
        setNewEntryDate(undefined);
        await populateData(granularity, fromDate, toDate);
    }
    
    let buildEditableValue = (
        componentId: string,
        index: number,
        isEditable: boolean,
        onUpdate: (entityId: string, date: Dayjs, value: MoneyDto, physicalAllocationId?: string) => Promise<void>,
        physicalAllocations?: OrderableEntityDto[],
        defaultPhysicalAllocation?: string | undefined
    ): CustomEditableColumn<ValueHistoryRecordDto> => {
        return {
            isEditable: isEditable,
            renderEditable: (record, closeCallback) => {
                let initialPhysicalAllocationId = record.newEntry
                    ? defaultPhysicalAllocation
                    : record.entities[index]?.physicalAllocationId;

                return (
                    <MoneyForm
                        initialValue={record.entities[index]?.value}
                        onSave={async (money, physicalAllocationId) => {
                            await onUpdate(componentId, dayjs(record.key), money, physicalAllocationId);
                            closeCallback();
                        }}
                        onCancel={closeCallback}
                        physicalAllocations={physicalAllocations}
                        defaultPhysicalAllocation={initialPhysicalAllocationId}
                    />
                );
            }
        }
    }
    
    let buildComponentColumns = (
        key: string,
        title: string | ReactNode,
        selector: (record: ValueHistoryRecordDto) => ValueSnapshotDto | undefined,
        showInferredValues: boolean,
        editableValue?: CustomEditableColumn<ValueHistoryRecordDto>,
        fixed?: 'right' | undefined,
    ): ColumnGroup<ValueHistoryRecordDto> => {
        return {
            title: title,
            children: [
                buildMoneyColumn(
                    `${key}-value`,
                    'Value',
                    record => selector(record)?.value,
                    false,
                    record => showInferredValues && ((selector(record) as EntityValueSnapshotDto)?.inferred ?? false),
                    fixed,
                    editableValue
                ),
                buildMoneyColumn(
                    `${key}-change`,
                    'Change',
                    record => selector(record)?.change,
                    true,
                    record => false,
                    fixed
                ),
                buildMoneyColumn(
                    `${key}-cumulative`,
                    'Cumulative',
                    record => selector(record)?.cumulativeChange,
                    true,
                    record => false,
                    fixed
                )
            ]
        }
    }
    
    let buildMoneyColumn = (
        key: string,
        title: string,
        selector: (record: ValueHistoryRecordDto) => MoneyDto | undefined,
        colorCoding: boolean,
        isInferred: (record: ValueHistoryRecordDto) => boolean,
        fixed: 'right' | undefined,
        editable?: CustomEditableColumn<ValueHistoryRecordDto>
    ): Column<ValueHistoryRecordDto> => {
        return {
            key: key,
            title: title,
            fixed: fixed,
            render: (record: ValueHistoryRecordDto) => (
                <Money
                    value={selector(record)}
                    colorCoding={colorCoding}
                    isInferred={isInferred(record)}
                />
            ),
            editable: editable
        }
    }

    let renderComponentTitle = (walletName: string, componentName: string) => {
        return (
            <Space direction='vertical'>
                <Text>{walletName}</Text>
                <Text>{componentName}</Text>
            </Space>
        );
    }

    let buildComponentsColumns = (
            components: EntityColumnDto[],
            granularity: DateGranularity,
            showInferredValues: boolean,
            onUpdate?: (entityId: string, date: Dayjs, value: MoneyDto, physicalAllocationId?: string) => Promise<void>,
            physicalAllocations?: OrderableEntityDto[]
        ): ColumnGroup<ValueHistoryRecordDto>[] => {
        let areAllComponentsInSameWallet = components
            .every(component => component.parentName == components[0].parentName);

        return components.map((component, index) => {
            let editable = onUpdate !== undefined
                ? buildEditableValue(
                    component!.id!,
                    index,
                    granularity == DateGranularity.Day,
                    onUpdate,
                    physicalAllocations,
                    component.defaultPhysicalAllocationId
                )
                : undefined;

            return buildComponentColumns(
                component.name,
                areAllComponentsInSameWallet
                    ? component.name
                    : renderComponentTitle(component.parentName!, component.name),
                record => record.entities[index],
                showInferredValues,
                editable
            );
        })
    }

    let buildSummaryColumn = (): ColumnGroup<ValueHistoryRecordDto> => {
        return buildComponentColumns('summary', 'Summary', record => record.summary, false, undefined, 'right');
    }

    let buildTargetColumn = (
        granularity: DateGranularity,
        onUpdate: (date: Dayjs, value: number) => Promise<void>
    ): Column<ValueHistoryRecordDto> => {
        const formatter = (amount: number) =>
            new Intl.NumberFormat('pl-PL', {
                style: 'currency',
                currency: 'PLN',
            }).format(amount)

        return {
            key: 'target',
            title: 'Target',
            fixed: 'right',
            render: record => record.target?.targetInMainCurrency === undefined
                ? '-'
                : (
                    <Space direction='vertical'>
                        <Space direction={"vertical"}>
                            {`${record.target?.percentage}%`}
                            <Text disabled>{formatter(record.target!.targetInMainCurrency)}</Text>
                        </Space>
                    </Space>
                ),
            editable: {
                isEditable: granularity == DateGranularity.Day,
                renderEditable: (row, closeCallback) =>
                    (
                        <TargetForm
                            initialValue={row.target?.targetInMainCurrency}
                            onSave={async value => {
                                await onUpdate(dayjs(row.key), value);
                                closeCallback();
                            }}
                            onCancel={closeCallback}
                        />
                    )
            }
        }
    }

    let buildInflationColumn = (
        granularity: DateGranularity,
        onUpdate: (year: number, month: number, value: number, confirmed: boolean) => Promise<void>
    ): ColumnGroup<ValueHistoryRecordDto> => {
        return {
            title: 'Score',
            children: [
                {
                    key: 'change-percent',
                    title: 'Change (%)',
                    fixed: 'right',
                    render: record => <ColoredPercent value={record.score?.changePercent} colorCoding={true}/>
                },
                {
                    key: 'inflation',
                    title: 'Inflation (%)',
                    fixed: 'right',
                    render: record => (
                        <ColoredPercent
                            value={record.score?.inflation?.value}
                            colorCoding={false}
                            extra={record.score?.inflation?.confirmed == false && (
                                <Tooltip title='Inflation value not yet confirmed'>
                                    <ExclamationCircleOutlined style={{ color: '#faad14', fontSize: '16px' }}/>
                                </Tooltip>
                            )}
                        />
                    ),
                    editable: {
                        isEditable: granularity == DateGranularity.Month,
                        renderEditable: (row, closeCallback) => {
                            let date = dayjs(row.key);

                            return (
                                <InflationForm
                                    year={date.year()}
                                    month={date.month() + 1}
                                    initialValue={row.score?.inflation}
                                    onUpdate={onUpdate}
                                    closeCallback={closeCallback}
                                />
                            );
                        }
                    }
                },
                {
                    key: 'total-score',
                    title: 'Total score (%)',
                    fixed: 'right',
                    render: record => <ColoredPercent value={record.score?.totalChangePercent} colorCoding={true}/>
                }
            ]
        }
    }

    let buildDeleteColumn = (
        onDeleteRow: (row: ValueHistoryRecordDto) => Promise<void>
    ): Column<ValueHistoryRecordDto> => {
        return {
            key: 'delete',
            title: '',
            fixed: 'right',
            render: (row: ValueHistoryRecordDto) => (
                <Popconfirm
                    title='Sure to delete?'
                    okText={'Yes'}
                    cancelText={'No'}
                    okButtonProps={{ danger: true }}
                    onConfirm={async () => await onDeleteRow(row)}
                >
                    <DeleteOutlined />
                </Popconfirm>
            )
        }
    }
    
    let columns: (Column<ValueHistoryRecordDto> | ColumnGroup<ValueHistoryRecordDto>)[] = [
        {
            key: 'date',
            title: 'Date',
            fixed: 'left',
            render: (record: ValueHistoryRecordDto) => record.key
        },
        ...buildComponentsColumns(
            data.columns,
            granularity,
            props.showInferredValues,
            async (id, date, value, physicalAllocationId) => {
                await props.editable!.onUpdate(id, date, value, physicalAllocationId);
                await onUpdateCallback();
            },
            physicalAllocations
        ),
        buildSummaryColumn(),
        buildTargetColumn(
            granularity,
            async (date, value) => {
                await props.editable?.setTarget?.(date, value);
                await onUpdateCallback();
            }
        ),
        buildInflationColumn(granularity, async (year: number, month: number, value: number, confirmed: boolean) => {
            await props.setInflation?.(year, month, value, confirmed);
            await onUpdateCallback();
        })
    ];
    
    if (props.editable?.onDelete !== undefined && granularity === DateGranularity.Day) {
        columns.push(
            buildDeleteColumn(async row => {
                await props.editable!.onDelete!(dayjs(row.key));
                await populateData(granularity, fromDate, toDate);
            })  
        );
    }
    
    const handleModalOk = () => {
        if (!selectedDate) {
            console.warn("No date selected");
            return;
        }

        setNewEntryDate(dayjs(selectedDate))
        setIsModalOpen(false);
    };

    const handleModalCancel = () => {
        setIsModalOpen(false);
    };

    const buildData = () => {
        if (newEntryDate === undefined) {
            return data.rows;
        }
        
        let newRow = {
            key: newEntryDate.format("YYYY-MM-DD"),
            entities: columns.map(_ => undefined),
            summary: undefined,
            target: undefined,
            score: undefined,
            newEntry: true
        }
        
        let newData = [
            ...data.rows,
            newRow
        ]

        return newData.sort((a, b) => dayjs(a.key).unix() - dayjs(b.key).unix());
    }
    
    return (
        <EmptyConfig enabled={data.columns.length === 0}>
            <div style={{ width: '95vw' }}>
                <Card 
                    title={props.title} 
                    extra={ 
                        <Space direction='horizontal'>
                            <DateGranularityPicker 
                                allowedDateRange={data.rows.length === 0 ? undefined : {
                                    start: dayjs(data.rows[0].key),
                                    end: dayjs(data.rows[data.rows.length - 1].key)
                                }}
                                onChange={async (granularity, start, end) => {
                                    setGranularity(granularity)
                                    setFromDate(start);
                                    setToDate(end);
                                    await populateData(granularity, start, end);
                                }}
                                allowedModes={props.allowedGranularities}
                                defaultMode={props.defaultGranularity}
                            />
                            {props.editable && <Button
                                icon={<PlusOutlined />}
                                onClick={() => setIsModalOpen(true)}
                            >
                                Add new entry
                            </Button>}
                        </Space>
                    }
                    style={{ width: '100%' }}
                >
                    <ExtendableTable
                        rows={buildData()} 
                        columns={columns}
                    />
                    <Divider/>
                    <MoneyCharts 
                        headers={data.columns}
                        data={data.rows}
                    />
                    {props.showCompositionChart && (<CompositionChart
                        headers={data.columns}
                        records={data.rows}
                    />)}
                    <TargetChart data={data.rows}/>
                    <ScoreChart data={data.rows}/>
                </Card>
                <Modal
                    title="Pick a date"
                    open={isModalOpen}
                    onOk={handleModalOk}
                    onCancel={handleModalCancel}
                >
                    <DatePicker onChange={setSelectedDate} />
                </Modal>
            </div>
        </EmptyConfig>
    );
}

export default EditableMoneyComponent;