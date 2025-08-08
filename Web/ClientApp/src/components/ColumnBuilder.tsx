import {
    ComponentHeader,
    ComponentValues,
    MoneyDto,
    ValueHistoryRecord,
    WalletComponentHistoryRecord, WalletHistoryRecord
} from "../api/ValueHistoryApi";
import {Column, ColumnGroup, CustomEditableColumn} from "./ExtendableTable";
import Money from "./Money";
import React from "react";
import MoneyForm from "./MoneyForm";
import {Space, Typography} from "antd";

const {Text} = Typography;

export function buildDateColumn<T extends ValueHistoryRecord>(): Column<T> {
    return {
        key: 'date',
        title: 'Date',
        fixed: 'left',
        render: record => record.date
    }
}

export function buildComponentsColumns<T extends ValueHistoryRecord>(
    components: ComponentHeader[],
    onUpdate?: (entityId: string, date: string, value: MoneyDto) => Promise<void>,
): ColumnGroup<T>[] {
    return components.map((component, index) => {
        let editable = onUpdate !== undefined
            ? buildEditableValue(component.id, index, onUpdate)
            : undefined;
        
        return buildComponentColumns(
            component.name, 
            record => record.components[index],
            editable
        );
    })
}

export function buildSummaryColumn<T extends ValueHistoryRecord>(): ColumnGroup<T> {
    return buildComponentColumns('Summary', record => record.summary);
}

export function buildTargetColumn<T extends WalletComponentHistoryRecord>(
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
            initialValueSelector: record => record.target?.targetInMainCurrency,
            onSave: (row, value) => onUpdate(row.date, value)
        }
    }
}

export function buildInflationColumn<T extends WalletHistoryRecord>(
    onUpdate: (date: string, value: number) => Promise<void>
): ColumnGroup<T> {
    return {
        title: 'Score',
        children: [
            {
                key: 'change-percent',
                title: 'Change (%)',
                fixed: 'right',
                render: record => renderPercent(record.yield.changePercent, true)
            },
            {
                key: 'inflation',
                title: 'Inflation (%)',
                fixed: 'right',
                render: record => renderPercent(record.yield.inflation, false),
                editable: {
                    initialValueSelector: record => record.yield.inflation,
                    onSave: (row, value) => onUpdate(row.date, value)
                }
            },
            {
                key: 'total-score',
                title: 'Total score (%)',
                fixed: 'right',
                render: record => renderPercent(record.yield.totalChangePercent, true)
            }
        ]
    }
}

function renderPercent(value: number, colorCoding: boolean) {
    const color = colorCoding && value !== 0
        ? (value > 0 ? 'green' : 'red')
        : 'black'
    
    return (
        <div style={{ cursor: 'pointer', color, textAlign: 'right' }}>
            {`${value.toFixed(2)}%`}
        </div>
    );
}

function buildComponentColumns<T extends ValueHistoryRecord>(
    title: string,
    selector: (record: T) => ComponentValues | undefined,
    editableValue?: CustomEditableColumn<T>
): ColumnGroup<T> {
    return {
        title: title,
        children: [
            buildMoneyColumn(
                'Value',
                record => selector(record)?.value,
                false,
                editableValue
            ),
            buildMoneyColumn(
                'Change',
                record => selector(record)?.change,
                true
            ),
            buildMoneyColumn(
                'Cumulative',
                record => selector(record)?.cumulativeChange,
                true
            )
        ]
    }
}

function buildMoneyColumn<T extends ValueHistoryRecord>(
    title: string,
    selector: (record: T) => MoneyDto | undefined,
    colorCoding: boolean,
    editable?: CustomEditableColumn<T>
): Column<T> {
    return {
        key: title,
        title: title,
        render: (record: T) => (
            <Money
                value={selector(record)}
                colorCoding={colorCoding}
            />
        ),
        editable: editable
    }
}

function buildEditableValue<T extends ValueHistoryRecord>(
    componentId: string,
    index: number,
    onUpdate: (entityId: string, date: string, value: MoneyDto) => Promise<void>
): CustomEditableColumn<T> {
    return {
        renderEditable: (record, closeCallback) => (
            <MoneyForm
                initialValue={record.components[index]?.value}
                onSave={async money => {
                    await onUpdate(componentId, record.date, money);
                    closeCallback();
                }}
                onCancel={closeCallback}
            />
        )
    }
}