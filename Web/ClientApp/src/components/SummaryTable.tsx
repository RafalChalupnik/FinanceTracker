import React, { FC } from 'react';
import {useState} from "react";
import {
    Button,
    DatePicker,
    Form,
    Input,
    InputNumber,
    InputNumberProps,
    Modal,
    Popconfirm,
    Space,
    Table,
    Typography
} from "antd";
import {type ColumnsType} from "antd/es/table";
import dayjs from "dayjs";
import {DeleteOutlined} from "@ant-design/icons";

const { Text } = Typography;

export type SummaryTableHeader = {
    name: string;
    id: string;
}

type SummaryTableComponent = {
    value: Money;
    change: Money;
    cumulativeChange: Money;
}

export type Money = {
    amount: number, 
    currency: string,
    amountInMainCurrency: number
}

export type SummaryTableRow = {
    date: Date;
    components: Array<SummaryTableComponent | undefined>;
    summary: SummaryTableComponent
}

export interface SummaryTableEditableProps {
    refreshData: () => Promise<SummaryTableRow[]>;
    onUpdate: (id: string, date: string, value: Money) => Promise<void>;
    onDelete: (date: string) => Promise<void>;
}

interface SummaryTableProps {
    headers: SummaryTableHeader[];
    data: SummaryTableRow[];
    editable?: SummaryTableEditableProps
}

interface DataType {
    key: string;
    date: Date;
    components: Array<SummaryTableComponent | undefined>;
}

type EditableCell = {
    rowKey: string;
    componentIndex: number;
} | null;

const SummaryTable: FC<SummaryTableProps> = (props) => {
    let mapData = (data : SummaryTableRow[]) => {
        return data.map(row => {
            return {
                key: row.date.toString(),
                date: row.date,
                components: [...row.components, ...[row.summary]]
            }
        })
    }
    
    const [data, setData] = useState(mapData(props.data));
    const [form] = Form.useForm();
    const [editingCell, setEditingCell] = useState<EditableCell>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);
    
    const save = async () => {
        if (!props.editable) {
            throw new Error('No editable props provided');
        }
        
        try {
            const values = await form.validateFields();
            if (!editingCell) return;

            const { rowKey, componentIndex } = editingCell;
            
            const newAmount = values['amount'] as number;
            const newCurrency = values['currency'] as (string | undefined) ?? "PLN";
            const newAmountInMainCurrency = values['amountInMainCurrency'] as (number | undefined) ?? newAmount;
            
            const newValue : Money = {
                amount: newAmount,
                currency: newCurrency,
                amountInMainCurrency: newAmountInMainCurrency
            }
            
            const componentId = props.headers[componentIndex].id;
            await props.editable.onUpdate(componentId, dayjs(new Date(Date.parse(rowKey))).format('YYYY-MM-DD'), newValue);
            
            let newData = mapData(await props.editable.refreshData())
            setData(newData);
            setEditingCell(null);
        } catch (err) {
            console.error('Validation failed:', err);
        }
    };
    
    const cancel = () => {
        setEditingCell(null);
    }
    
    const formatAmount = (
        value: Money | undefined, 
        colorCoding: boolean,
        onDoubleClick: () => void
    ) => {
        if (value === undefined) {
            return (
                <div
                    style={{ cursor: 'pointer', textAlign: 'right' }}
                    onDoubleClick={onDoubleClick}
                >
                    -
                </div>
            );
        }

        let amount = new Intl.NumberFormat('pl-PL', {
            style: 'currency',
            currency: value.currency,
        }).format(value.amount)

        const color = value.amountInMainCurrency !== 0 && colorCoding
            ? (value.amountInMainCurrency > 0 ? 'green' : 'red')
            : 'black'
        
        if (value.amountInMainCurrency !== value.amount) {
            let amountInMainCurrency = new Intl.NumberFormat('pl-PL', {
                style: 'currency',
                currency: 'PLN',
            }).format(value.amountInMainCurrency)

            return (
                <div
                    style={{ cursor: 'pointer', color, textAlign: 'right' }}
                    onDoubleClick={onDoubleClick}
                >
                    <Space direction={"vertical"}>
                        {amount}
                        <Text disabled>{`(${amountInMainCurrency})`}</Text>
                    </Space>
                </div>
            )
        }
        else
        {
            return (
                <div
                    style={{ cursor: 'pointer', color, textAlign: 'right' }}
                    onDoubleClick={onDoubleClick}
                >
                    {amount}
                </div>
            )
        }
    }
    
    const renderUneditableCell = (
        record: DataType,
        componentIndex: number,
        field: keyof SummaryTableComponent,
        colorCoding: boolean
    ) => {
        const component = record.components[componentIndex];
        const value = component?.[field] as (Money | undefined);
        
        return formatAmount(value, colorCoding, () => {
            setEditingCell({
                rowKey: record.key,
                componentIndex
            });

            setTimeout(() => {
                form.setFieldsValue({
                    amount: value?.amount,
                });
            }, 0);
        })
    }

    const renderEditableCell = (
        record: DataType,
        componentIndex: number,
        field: keyof SummaryTableComponent
    ) => {
        const isEditing =
            editingCell?.rowKey === record.key &&
            editingCell?.componentIndex === componentIndex;

        return isEditing ? (
            <Space direction={"vertical"}>
                <Form.Item name="amount" style={{ margin: 0 }}>
                    <InputNumber
                        style={{ width: '100%' }}
                        min={0}
                        step={0.01}
                        placeholder="0,00"
                    />
                </Form.Item>
                <Form.Item name="currency" style={{ margin: 0 }}>
                    <Input placeholder="PLN" minLength={3} maxLength={3} />
                </Form.Item>
                <Form.Item name="amountInMainCurrency" style={{ margin: 0 }}>
                    <InputNumber
                        style={{ width: '100%' }}
                        min={0}
                        step={0.01}
                        placeholder="0,00"
                    />
                </Form.Item>
                <Space direction={"horizontal"}>
                    <Button onClick={save}>Save</Button>
                    <Button onClick={cancel}>Cancel</Button>
                </Space>
            </Space>
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
                    render: (_: any, record: DataType) => isEditable && props.editable
                        ? renderEditableCell(record, index, 'value')
                        : renderUneditableCell(record, index, 'value', false)
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
    
    if (props.editable) {
        columns.push({
            title: '',
            dataIndex: 'operation',
            render: (_, record) =>
                data.length >= 1 ? (
                    <Popconfirm 
                        title="Sure to delete?" 
                        okText={'Yes'}
                        cancelText={'No'}
                        okButtonProps={{ danger: true }}
                        onConfirm={async () => {
                            await props.editable!.onDelete(dayjs(new Date(Date.parse(record.key))).format('YYYY-MM-DD'));
                            let newData = mapData(await props.editable!.refreshData())
                            setData(newData);
                        }}
                    >
                        {/*<span style={{ color: '#1890ff', textDecoration: 'underline', cursor: 'pointer' }}>*/}
                        {/*    Delete*/}
                        {/*</span>*/}
                        <DeleteOutlined />
                    </Popconfirm>
                ) : null,
        })
    }

    const handleAdd = () => {
        setIsModalOpen(true);
    };

    const handleOk = () => {
        // console.log('Confirmed date:', selectedDate?.format('YYYY-MM-DD'));
        console.log('Confirmed date:', selectedDate?.toISOString());
        
        let newData = [
            ...data,
            {
                key: selectedDate!.toString(),
                date: selectedDate!,
                components: props.headers.map(_ => undefined)
            }
        ]
        setData(newData.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()));
        
        setIsModalOpen(false);
    };

    const handleCancel = () => {
        setIsModalOpen(false);
    };
    
    return (
        <Form form={form} component={false}>
            <Space direction={"vertical"}>
                <Table
                    bordered
                    dataSource={data}
                    columns={columns}
                    pagination={false}
                    rowKey="key"
                    scroll={{ x: 'max-content' }}
                />
                {props.editable && (
                    <Button onClick={handleAdd} type="primary" style={{ marginBottom: 16 }}>
                        Add a row
                    </Button>
                )}
            </Space>
            <Modal
                title="Pick a date"
                open={isModalOpen}
                onOk={handleOk}
                onCancel={handleCancel}
            >
                <DatePicker onChange={setSelectedDate} />
            </Modal>
        </Form>
    )
};

export default SummaryTable;