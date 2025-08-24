import {Column, ColumnGroup, CustomEditableColumn} from "./ExtendableTable";
import React, {ReactNode} from "react";
import {Popconfirm, Space, Tooltip, Typography} from "antd";
import {
    EntityColumnDto,
    ValueHistoryRecordDto,
    WalletComponentsValueHistoryRecordDto,
    WalletValueHistoryRecordDto
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

export function buildDateColumn<T extends ValueHistoryRecordDto>(): Column<T> {
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

export function buildTargetColumn<T extends WalletComponentsValueHistoryRecordDto>(
    granularity: DateGranularity,
    onUpdate: (date: Dayjs, value: number) => Promise<void>
): Column<T> {
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

export function buildInflationColumn<T extends WalletValueHistoryRecordDto>(
    granularity: DateGranularity,
    onUpdate: (year: number, month: number, value: number, confirmed: boolean) => Promise<void>
): ColumnGroup<T> {
    return {
        title: 'Score',
        children: [
            {
                key: 'change-percent',
                title: 'Change (%)',
                fixed: 'right',
                render: record => <ColoredPercent value={record.yield.changePercent} colorCoding={true}/>
            },
            {
                key: 'inflation',
                title: 'Inflation (%)',
                fixed: 'right',
                render: record => (
                    <ColoredPercent 
                        value={record.yield.inflation?.value} 
                        colorCoding={false} 
                        extra={record.yield.inflation?.confirmed == false && (
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
                                initialValue={row.yield.inflation}
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
                render: record => <ColoredPercent value={record.yield.totalChangePercent} colorCoding={true}/>
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

function buildComponentColumns<T extends ValueHistoryRecordDto>(
    key: string,
    title: string | ReactNode,
    selector: (record: T) => ValueSnapshotDto | undefined,
    showInferredValues: boolean,
    editableValue?: CustomEditableColumn<T>,
    fixed?: 'right' | undefined,
): ColumnGroup<T> {
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

function buildMoneyColumn<T extends ValueHistoryRecordDto>(
    key: string,
    title: string,
    selector: (record: T) => MoneyDto | undefined,
    colorCoding: boolean,
    isInferred: (record: T) => boolean,
    fixed: 'right' | undefined,
    editable?: CustomEditableColumn<T>
): Column<T> {
    return {
        key: key,
        title: title,
        fixed: fixed,
        render: (record: T) => (
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