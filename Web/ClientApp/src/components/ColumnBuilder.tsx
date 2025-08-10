import {Column, ColumnGroup, CustomEditableColumn} from "./ExtendableTable";
import Money from "./Money";
import React from "react";
import MoneyForm from "./MoneyForm";
import {Popconfirm, Space, Tooltip, Typography} from "antd";
import {
    EntityColumnDto,
    ValueHistoryRecordDto,
    WalletComponentsValueHistoryRecordDto,
    WalletValueHistoryRecordDto
} from "../api/value-history/DTOs/EntityTableDto";
import {MoneyDto} from "../api/value-history/DTOs/Money";
import {ValueSnapshotDto} from "../api/value-history/DTOs/ValueSnapshotDto";
import {DateGranularity} from "../api/value-history/DTOs/DateGranularity";
import {DeleteOutlined, ExclamationCircleOutlined} from "@ant-design/icons";
import InflationForm from "./InflationForm";
import dayjs from "dayjs";
import ColoredPercent from "./ColoredPercent";

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
    onUpdate?: (entityId: string, date: string, value: MoneyDto) => Promise<void>,
): ColumnGroup<T>[] {
    return components.map((component, index) => {
        let editable = onUpdate !== undefined
            ? buildEditableValue(component!.id!, index, granularity == DateGranularity.Day, onUpdate)
            : undefined;
        
        return buildComponentColumns(
            component.name, 
            record => record.entities[index],
            editable
        );
    })
}

export function buildSummaryColumn<T extends ValueHistoryRecordDto>(): ColumnGroup<T> {
    return buildComponentColumns('Summary', record => record.summary, undefined, 'right');
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
    onUpdate: (date: string, value: number) => Promise<void>
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
            initialValueSelector: record => record.target?.targetInMainCurrency,
            onSave: (row, value) => onUpdate(row.key, value)
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

function renderPercent(value: number | undefined | null, colorCoding: boolean) {
    if (value === undefined || value === null) {
        return (
            <div style={{ cursor: 'pointer', textAlign: 'right' }}>
                -
            </div>
        );
    }
    
    const color = colorCoding && value !== 0
        ? (value > 0 ? 'green' : 'red')
        : 'black'
    
    return (
        <div style={{ cursor: 'pointer', color, textAlign: 'right' }}>
            {`${value.toFixed(2)}%`}
        </div>
    );
}

function buildComponentColumns<T extends ValueHistoryRecordDto>(
    title: string,
    selector: (record: T) => ValueSnapshotDto | undefined,
    editableValue?: CustomEditableColumn<T>,
    fixed?: 'right' | undefined,
): ColumnGroup<T> {
    return {
        title: title,
        children: [
            buildMoneyColumn(
                `${title}-value`,
                'Value',
                record => selector(record)?.value,
                false,
                fixed,
                editableValue
            ),
            buildMoneyColumn(
                `${title}-change`,
                'Change',
                record => selector(record)?.change,
                true,
                fixed
            ),
            buildMoneyColumn(
                `${title}-cumulative`,
                'Cumulative',
                record => selector(record)?.cumulativeChange,
                true,
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
            />
        ),
        editable: editable
    }
}

function buildEditableValue<T extends ValueHistoryRecordDto>(
    componentId: string,
    index: number,
    isEditable: boolean,
    onUpdate: (entityId: string, date: string, value: MoneyDto) => Promise<void>
): CustomEditableColumn<T> {
    return {
        isEditable: isEditable,
        renderEditable: (record, closeCallback) => (
            <MoneyForm
                initialValue={record.entities[index]?.value}
                onSave={async money => {
                    await onUpdate(componentId, record.key, money);
                    closeCallback();
                }}
                onCancel={closeCallback}
            />
        )
    }
}