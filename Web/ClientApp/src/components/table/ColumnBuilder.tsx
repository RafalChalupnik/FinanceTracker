import {Column, ColumnGroup, CustomEditableColumn} from "./ExtendableTable";
import React, {ReactNode} from "react";
import {Popconfirm, Space, Tooltip, Typography} from "antd";
import {
    EntityColumnDto,
    ValueHistoryRecordDto
} from "../../api/value-history/DTOs/EntityTableDto";
import {MoneyDto} from "../../api/value-history/DTOs/Money";
import {EntityValueSnapshotDto, ValueSnapshotDto} from "../../api/value-history/DTOs/ValueSnapshotDto";
import {DateGranularity} from "../../api/value-history/DTOs/DateGranularity";
import {DeleteOutlined, ExclamationCircleOutlined} from "@ant-design/icons";
import InflationForm from "../money/InflationForm";
import dayjs, {Dayjs} from "dayjs";
import ColoredPercent from "../ColoredPercent";
import MoneyForm from "../money/MoneyForm";
import Money from "../money/Money";
import {OrderableEntityDto} from "../../api/configuration/DTOs/ConfigurationDto";
import TargetForm from "../money/TargetForm";

const {Text} = Typography;

export function buildDateColumn(): Column<ValueHistoryRecordDto> {
    return {
        key: 'date',
        title: 'Date',
        fixed: 'left',
        render: record => record.key
    }
}

export function buildComponentsColumns<T extends ValueHistoryRecordDto>(
    components: EntityColumnDto[],
    granularity: DateGranularity,
    showInferredValues: boolean,
    onUpdate?: (entityId: string, date: Dayjs, value: MoneyDto, physicalAllocationId?: string) => Promise<void>,
    physicalAllocations?: OrderableEntityDto[]
): ColumnGroup<T>[] {
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

export function buildSummaryColumn<T extends ValueHistoryRecordDto>(): ColumnGroup<T> {
    return buildComponentColumns('summary', 'Summary', record => record.summary, false, undefined, 'right');
}

export function buildDeleteColumn<T>(
    onDeleteRow: (row: T) => Promise<void>
): Column<T> {
    return {
        key: 'delete',
        title: '',
        fixed: 'right',
        render: (row: T) => (
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

export function buildTargetColumn(
    granularity: DateGranularity,
    onUpdate: (date: Dayjs, value: number) => Promise<void>
): Column<ValueHistoryRecordDto> {
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

export function buildInflationColumn(
    granularity: DateGranularity,
    onUpdate: (year: number, month: number, value: number, confirmed: boolean) => Promise<void>
): ColumnGroup<ValueHistoryRecordDto> {
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

function renderComponentTitle(walletName: string, componentName: string) {
    return (
        <Space direction='vertical'>
            <Text>{walletName}</Text>
            <Text>{componentName}</Text>
        </Space>
    );
}

function buildComponentColumns(
    key: string,
    title: string | ReactNode,
    selector: (record: ValueHistoryRecordDto) => ValueSnapshotDto | undefined,
    showInferredValues: boolean,
    editableValue?: CustomEditableColumn<ValueHistoryRecordDto>,
    fixed?: 'right' | undefined,
): ColumnGroup<ValueHistoryRecordDto> {
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

function buildMoneyColumn(
    key: string,
    title: string,
    selector: (record: ValueHistoryRecordDto) => MoneyDto | undefined,
    colorCoding: boolean,
    isInferred: (record: ValueHistoryRecordDto) => boolean,
    fixed: 'right' | undefined,
    editable?: CustomEditableColumn<ValueHistoryRecordDto>
): Column<ValueHistoryRecordDto> {
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

function buildEditableValue<T extends ValueHistoryRecordDto>(
    componentId: string,
    index: number,
    isEditable: boolean,
    onUpdate: (entityId: string, date: Dayjs, value: MoneyDto, physicalAllocationId?: string) => Promise<void>,
    physicalAllocations?: OrderableEntityDto[],
    defaultPhysicalAllocation?: string | undefined
): CustomEditableColumn<T> {
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