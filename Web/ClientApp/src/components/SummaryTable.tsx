import React, { FC } from 'react';
import {useState} from "react";
import {Form, InputNumber, Table} from "antd";
import {type ColumnsType} from "antd/es/table";


export type SummaryTableHeader = {
    name: string;
    id: string;
}

type SummaryTableComponent = {
    value: number;
    change: number;
    cumulativeChange: number;
    id: string;
}

export type SummaryTableRow = {
    date: Date;
    components: Array<SummaryTableComponent | undefined>;
    summary: SummaryTableComponent
}

interface SummaryTableProps {
    headers: SummaryTableHeader[];
    data: SummaryTableRow[];
    isEditable: boolean
    onUpdate?: (id: string, date: string, value: number) => void;
    onDelete?: (date: Date) => void;
}

interface DataType {
    key: string;
    date: Date;
    components: Array<SummaryTableComponent | undefined>;
}

type EditableCell = {
    rowKey: string;
    componentIndex: number;
    field: keyof SummaryTableComponent;
} | null;

const SummaryTable: FC<SummaryTableProps> = (props) => {
    let dataSource : DataType[] = props.data.map(row => {
        return {
            key: row.date.toString(),
            date: row.date,
            components: [...row.components, ...[row.summary]]
        }
    })
    
    const [data, setData] = useState(dataSource);
    const [form] = Form.useForm();
    const [editingCell, setEditingCell] = useState<EditableCell>(null);
    
    const save = async () => {
        try {
            const values = await form.validateFields();
            if (!editingCell) return;

            const { rowKey, componentIndex, field } = editingCell;
            const newValue = values['editable'];

            const newData = [...data];
            const rowIndex = newData.findIndex(item => item.key === rowKey);
            if (rowIndex === -1) return;

            const row = newData[rowIndex];
            const component = row.components[componentIndex];
            if (!component) return;

            row.components[componentIndex] = {
                ...component,
                [field]: newValue,
            };

            setData(newData);
            setEditingCell(null);
        } catch (err) {
            console.error('Validation failed:', err);
        }
    };
    
    const renderUneditableCell = (
        record: DataType,
        componentIndex: number,
        field: keyof SummaryTableComponent,
        colorCoding: boolean
    ) => {
        const component = record.components[componentIndex];
        const rawValue = component?.[field];
        
        const value = typeof rawValue === 'number'
            ? rawValue as number
            : undefined;
        
        const formattedValue = value !== undefined
            ? new Intl.NumberFormat('pl-PL', {
                style: 'currency',
                currency: 'PLN',
            }).format(value)
            : '-';

        const color = value !== undefined && value !== 0 && colorCoding
            ? (value > 0 ? 'green' : 'red')
            : 'black'

        return (
            <div
                style={{ cursor: 'pointer', color }}
                onDoubleClick={() => {
                    form.setFieldsValue({ editable: value });
                    setEditingCell({
                        rowKey: record.key,
                        componentIndex,
                        field,
                    });
                }}
            >
                {formattedValue}
            </div>
        )
    }

    const renderEditableCell = (
        record: DataType,
        componentIndex: number,
        field: keyof SummaryTableComponent
    ) => {
        const isEditing =
            editingCell?.rowKey === record.key &&
            editingCell?.componentIndex === componentIndex &&
            editingCell?.field === field;

        return isEditing ? (
            <Form.Item name="editable" style={{ margin: 0 }}>
                <InputNumber autoFocus onPressEnter={save} onBlur={save} />
            </Form.Item>
        ) : renderUneditableCell(record, componentIndex, field, false);
    };

    function buildComponentColumns (name: string, index: number, isEditable: boolean) {
        return {
            title: name,
            children: [
                {
                    title: 'Value',
                    dataIndex: ['components', index, 'value'],
                    key: `${name}-value`,
                    render: (_: any, record: DataType) => isEditable && props.isEditable
                        ? renderEditableCell(record, index, 'value')
                        : (record.components[index]?.['value'])
                },
                {
                    title: 'Change',
                    dataIndex: ['components', index, 'change'],
                    key: `${name}-change`,
                    render: (_: any, record: DataType) => renderUneditableCell(record, index, 'change', true)
                },
                {
                    title: 'Cumulative',
                    dataIndex: ['components', index, 'cumulativeChange'],
                    key: `${name}-cumulativeChange`,
                    render: (_: any, record: DataType) => renderUneditableCell(record, index, 'cumulativeChange', true)
                }
            ]
        }
    }

    const componentsColumns = props.headers.map((header, componentIndex) => {
        return buildComponentColumns(header.name, componentIndex, true)
    })

    const columns: ColumnsType<DataType> = [
        {
            title: 'Date',
            dataIndex: 'date',
            key: 'date',
            render: (date: Date) => new Date(date).toLocaleDateString(),
            fixed: 'left',
        },
        ...componentsColumns,
        buildComponentColumns('Summary', props.headers.length, false)
    ];
    
    return (
        <Form form={form} component={false}>
            <Table
                bordered
                dataSource={data}
                columns={columns}
                pagination={false}
                rowKey="key"
                scroll={{ x: 'max-content' }}
            />
        </Form>
    )
};

export default SummaryTable;