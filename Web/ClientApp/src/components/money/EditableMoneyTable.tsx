import React, {FC, ReactNode, useState} from "react";
import {Column, ColumnGroup, CustomEditableColumn, ExtendableTable} from "../table/ExtendableTable";
import {EntityColumnDto, EntityTableDto, ValueHistoryRecordDto} from "../../api/value-history/DTOs/EntityTableDto";
import dayjs, {Dayjs} from "dayjs";
import {ValueSnapshotDto} from "../../api/value-history/DTOs/ValueSnapshotDto";
import Money from "./Money";
import {DateGranularity} from "../../api/value-history/DTOs/DateGranularity";
import {MoneyDto} from "../../api/value-history/DTOs/Money";
import MoneyForm from "./MoneyForm";
import {OrderableEntityDto} from "../../api/configuration/DTOs/ConfigurationDto";
import {Popconfirm, Space, Tooltip, Typography} from "antd";
import TargetForm from "./TargetForm";
import ColoredPercent from "../ColoredPercent";
import {DeleteOutlined, ExclamationCircleOutlined} from "@ant-design/icons";
import InflationForm from "./InflationForm";

const {Text} = Typography;

const buildDateColumn = (): Column<ValueHistoryRecordDto> => ({
    key: 'date',
    title: 'Date',
    fixed: 'left',
    render: (record: ValueHistoryRecordDto) => record.key
});

const buildComponentColumnGroup = (
    key: string, 
    title: string | ReactNode,
    selector: (record: ValueHistoryRecordDto) => ValueSnapshotDto | undefined,
    isInferred: (record: ValueHistoryRecordDto) => boolean,
    fixed?: 'right' | undefined,
    editable?: CustomEditableColumn<ValueHistoryRecordDto>
): ColumnGroup<ValueHistoryRecordDto> => {
    return ({
        title: title,
        children: [
            {
                key: `${key}-value`,
                title: 'Value',
                fixed: fixed,
                render: record => (
                    <Money
                        value={selector(record)?.value}
                        colorCoding={false}
                        isInferred={isInferred(record)}
                    />
                ),
                editable: editable,
            },
            {
                key: `${key}-change`,
                title: 'Change',
                fixed: fixed,
                render: record => (
                    <Money
                        value={selector(record)?.change}
                        colorCoding={true}
                        isInferred={false}
                    />
                )
            },
            {
                key: `${key}-cumulative`,
                title: 'Cumulative',
                fixed: fixed,
                render: record => (
                    <Money
                        value={selector(record)?.cumulativeChange}
                        colorCoding={true}
                        isInferred={false}
                    />
                )
            }
        ]
    });
};

const buildComponentsColumnGroups = (
    components: EntityColumnDto[],
    granularity: DateGranularity,
    showInferredValues: boolean,
    onUpdate?: (entityId: string, date: Dayjs, value: MoneyDto, physicalAllocationId?: string) => Promise<void>,
    physicalAllocations?: OrderableEntityDto[]
): ColumnGroup<ValueHistoryRecordDto>[] => {
    let areAllComponentsInSameGroup = components
        .every(component => component.parentName == components[0].parentName);

    return components.map((component, index) => {
        let editable = onUpdate !== undefined
            ? (
                {
                    isEditable: granularity == DateGranularity.Day,
                    renderEditable: (record, closeCallback) => {
                        let initialPhysicalAllocationId = record.newEntry
                            ? component.defaultPhysicalAllocationId
                            : record.entities[index]?.physicalAllocationId;

                        return (
                            <MoneyForm
                                initialValue={record.entities[index]?.value}
                                onSave={async (money, physicalAllocationId) => {
                                    await onUpdate(component.id, dayjs(record.key), money, physicalAllocationId);
                                    closeCallback();
                                }}
                                onCancel={closeCallback}
                                physicalAllocations={physicalAllocations}
                                defaultPhysicalAllocation={initialPhysicalAllocationId}
                            />
                        );
                    }
                } as CustomEditableColumn<ValueHistoryRecordDto>
            )
            : undefined;

        return buildComponentColumnGroup(
            component.name,
            areAllComponentsInSameGroup
                ? component.name
                : (
                    <Space direction='vertical'>
                        <Text>{component.parentName}</Text>
                        <Text>{component.name}</Text>
                    </Space>
                ),
            record => record.entities[index],
            record => showInferredValues && (record.entities[index]?.inferred ?? false),
            undefined,
            editable
        )
    })
}

const buildSummaryColumnGroup = (): ColumnGroup<ValueHistoryRecordDto> => buildComponentColumnGroup(
    'summary',
    'Summary',
    record => record.summary,
    record => false,
    'right',
    undefined
);

const buildTargetColumn = (
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

const buildInflationColumnGroup = (
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

const buildDeleteColumn = (
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

interface EditableMoneyTableProps {
    columns: EntityColumnDto[],
    rows: ValueHistoryRecordDto[],
    granularity: DateGranularity,
    showInferredValues: boolean,
    physicalAllocations: OrderableEntityDto[],
    onComponentUpdate?: (id: string, date: Dayjs, value: MoneyDto, physicalAllocationId?: string) => Promise<void>,
    onComponentDelete?: (date: Dayjs) => Promise<void>,
    onTargetUpdate?: (date: Dayjs, value: number) => Promise<void>,
    onInflationUpdate?: (year: number, month: number, value: number, confirmed: boolean) => Promise<void>;
}

const EditableMoneyTable: FC<EditableMoneyTableProps> = (props) => {
    let columns: (Column<ValueHistoryRecordDto> | ColumnGroup<ValueHistoryRecordDto>)[] = [
        buildDateColumn(),
        ...buildComponentsColumnGroups(
            props.columns,
            props.granularity,
            props.showInferredValues,
            props.onComponentUpdate,
            props.physicalAllocations
        ),
        buildSummaryColumnGroup()
    ];
    
    if (props.onTargetUpdate !== undefined)
    {
        columns.push(
            buildTargetColumn(
                props.granularity,
                props.onTargetUpdate
            )
        );
    }
    
    if (props.onInflationUpdate !== undefined)
    {
        columns.push(
            buildInflationColumnGroup(
                props.granularity,
                props.onInflationUpdate
            )
        );
    }

    if (props.onComponentDelete !== undefined && props.granularity === DateGranularity.Day) {
        columns.push(
            buildDeleteColumn(async row => await props.onComponentDelete!(dayjs(row.key)))
        );
    }
    
    return (
        <ExtendableTable
            rows={props.rows}
            columns={columns}
        />
    );
};

export default EditableMoneyTable;