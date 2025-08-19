import React, {useState} from "react";
import dayjs, {Dayjs} from "dayjs";
import {Button, Card, DatePicker, Modal, Space, Typography} from "antd";
import {PlusOutlined} from "@ant-design/icons";
import { DateGranularity } from "../../api/value-history/DTOs/DateGranularity";
import { EntityColumnDto, ValueHistoryRecordDto } from "../../api/value-history/DTOs/EntityTableDto";
import {Column, ColumnGroup, ExtendableTable} from "../table/ExtendableTable";
import { MoneyDto } from "../../api/value-history/DTOs/Money";
import {buildComponentsColumns, buildDateColumn, buildDeleteColumn, buildSummaryColumn} from "../table/ColumnBuilder";
import DateGranularityPicker from "../DateGranularityPicker";
import MoneyChart from "../charts/custom/MoneyChart";
import CompositionChart from "../charts/custom/CompositionChart";
import {OrderableEntityDto} from "../../api/configuration/DTOs/ConfigurationDto";

const { Title } = Typography;

interface EditableMoneyComponentProps<T> {
    title: string;
    rows: T[]
    columns: EntityColumnDto[],
    refreshData: (granularity?: DateGranularity, from?: Dayjs, to?: Dayjs) => Promise<void>;
    showInferredValues: boolean;
    buildExtraColumns?: (granularity: DateGranularity) => (Column<T> | ColumnGroup<T>)[];
    editable?: EditableProps<T>;
    extra?: React.ReactNode;
    allowedGranularities?: DateGranularity[];
    defaultGranularity?: DateGranularity;
    physicalAllocations?: OrderableEntityDto[];
    defaultPhysicalAllocation?: string;
}

interface EditableProps<T> {
    createEmptyRow: (date: Dayjs, columns: EntityColumnDto[]) => T;
    onUpdate: (id: string, date: string, value: MoneyDto, physicalAllocationId?: string) => Promise<void>;
    onDelete?: (date: string) => Promise<void>;
} 

export function EditableMoneyComponent<T extends ValueHistoryRecordDto>(props: EditableMoneyComponentProps<T>) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedDate, setSelectedDate] = useState<Dayjs | undefined>(undefined);
    const [newEntryDate, setNewEntryDate] = useState<Dayjs | undefined>(undefined);
    const [granularity, setGranularity] = useState<DateGranularity>(props.defaultGranularity ?? DateGranularity.Day);
    
    let onUpdate = props.editable !== undefined
        ? async (id: string, date: string, value: MoneyDto, physicalAllocationId?: string) => {
            setNewEntryDate(undefined);
            await props.editable?.onUpdate(id, date, value, physicalAllocationId);
        }
        : undefined;

    let columns = [
        buildDateColumn(),
        ...buildComponentsColumns(
            props.columns, 
            granularity,
            props.showInferredValues ?? true,
            onUpdate,
            props.physicalAllocations
        ),
        buildSummaryColumn(),
        ...(props.buildExtraColumns
            ? props.buildExtraColumns!(granularity) 
            : []
        )
    ]
    
    if (props.editable?.onDelete !== undefined && granularity == DateGranularity.Day) {
        columns.push(
            buildDeleteColumn(async row => await props.editable!.onDelete!(row.key))  
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
            return props.rows;
        }
        
        let newRow = props.editable!.createEmptyRow(newEntryDate, props.columns)

        let newData = [
            ...props.rows,
            newRow
        ]

        return newData.sort((a, b) => dayjs(a.key).unix() - dayjs(b.key).unix());
    }
    
    return (
        <div style={{ width: '95vw' }}>
            <Card 
                title={props.title} 
                extra={ 
                    <Space direction='horizontal'>
                        <DateGranularityPicker 
                            allowedDateRange={props.rows.length === 0 ? undefined : {
                                start: dayjs(props.rows[0].key),
                                end: dayjs(props.rows[props.rows.length - 1].key)
                            }}
                            onChange={async (granularity, start, end) => {
                                setGranularity(granularity)
                                await props.refreshData(granularity, start, end);
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
                <Title style={{paddingTop: '30px'}} level={5}>Value</Title>
                <MoneyChart 
                    headers={props.columns}
                    data={props.rows}
                    dataSelector={component => component.value}
                />
                <Title level={5}>Change</Title>
                <MoneyChart
                    headers={props.columns}
                    data={props.rows}
                    dataSelector={component => component.change}
                />
                <Title level={5}>Cumulative change</Title>
                <MoneyChart
                    headers={props.columns}
                    data={props.rows}
                    dataSelector={component => component.cumulativeChange}
                />
                <CompositionChart
                    headers={props.columns}
                    records={props.rows}
                />
                {props.extra}
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
    );
}