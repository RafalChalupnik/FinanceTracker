import React, {ReactNode, useState} from 'react';
import {Button, TableProps} from 'antd';
import { Form, Input, InputNumber, Table } from 'antd';
import {ColumnType} from "antd/es/table";
import SaveCancelButtons from "../SaveCancelButtons";
import {EditOutlined} from "@ant-design/icons";

interface DataType {
    key: string;
    name: string
    age: number;
    address: string;
}

interface EditableCellProps extends React.HTMLAttributes<HTMLElement> {
    editing: boolean;
    dataIndex: string;
    title: any;
    inputType: 'number' | 'text';
    record: DataType;
    index: number;
}

const EditableCell: React.FC<React.PropsWithChildren<EditableCellProps>> = ({
                                                                                editing,
                                                                                dataIndex,
                                                                                title,
                                                                                inputType,
                                                                                record,
                                                                                index,
                                                                                children,
                                                                                ...restProps
                                                                            }) => {
    const inputNode = inputType === 'number' ? <InputNumber /> : <Input />;

    return (
        <td {...restProps}>
            {editing ? (
                <Form.Item
                    name={dataIndex}
                    style={{ margin: 0 }}
                    rules={[
                        {
                            required: true,
                            message: `Please Input ${title}!`,
                        },
                    ]}
                >
                    {inputNode}
                </Form.Item>
            ) : (
                children
            )}
        </td>
    );
};

interface EditableRowsTableProps<T> {
    data: T[],
    columns: EditableColumnType<T>[],
    onChange: (row: T) => void
}

export interface EditableColumnType<T> extends ColumnType<T> {
    inputType: string,
    editable: boolean,
    renderCell?: (record: T, isEditing: boolean) => ReactNode,
}

export function EditableRowsTable<T extends {key: React.Key}>(props: EditableRowsTableProps<T>) {
    const [form] = Form.useForm();
    const [data, setData] = useState<T[]>(props.data);
    const [editingKey, setEditingKey] = useState<React.Key>('');

    const isEditing = (record: T) => record.key === editingKey;

    const edit = (record: Partial<T> & { key: React.Key }) => {
        form.setFieldsValue({ ...record });
        setEditingKey(record.key);
    };

    const cancel = () => {
        setEditingKey('');
    };

    const save = async (key: React.Key) => {
        try {
            const row = (await form.validateFields()) as T;

            const newData = [...data];
            const index = newData.findIndex((item) => key === item.key);
            if (index > -1) {
                const item = newData[index];
                newData.splice(index, 1, {
                    ...item,
                    ...row,
                });
                setData(newData);
                setEditingKey('');
            } else {
                newData.push(row);
                setData(newData);
                setEditingKey('');
            }
            
            props.onChange(row);
        } catch (errInfo) {
            console.log('Validate Failed:', errInfo);
        }
    };

    const columns: EditableColumnType<T>[] = [
        ...props.columns,
        // {
        //     title: 'name',
        //     dataIndex: 'name',
        //     width: '25%',
        //     editable: true,
        // },
        // {
        //     title: 'age',
        //     dataIndex: 'age',
        //     width: '15%',
        //     editable: true,
        // },
        // {
        //     title: 'address',
        //     dataIndex: 'address',
        //     width: '40%',
        //     editable: true,
        // },
        {
            title: '',
            dataIndex: 'operation',
            inputType: '',
            editable: false,
            render: (_: any, record: T) => {
                const editable = isEditing(record);
                return editable 
                    ? (<SaveCancelButtons onSave={() => save(record.key)} onCancel={cancel}/>) 
                    : (<Button icon={<EditOutlined onClick={() => edit(record)} />}/>)
            },
        },
    ];

    const mergedColumns: TableProps<T>['columns'] = columns.map((col) => {
        if (!col.editable) {
            return col;
        }
        return {
            ...col,
            render: col.renderCell
                ? ((value, record, index) => col.renderCell!(record, isEditing(record)))
                : null,
            onCell: (record: T) => ({
                record,
                inputType: col.inputType,
                dataIndex: col.dataIndex,
                title: col.title,
                editing: isEditing(record),
            }),
        } as ColumnType<T>
    });

    return (
        <Form form={form} component={false}>
            <Table<T>
                components={{
                    body: { cell: EditableCell },
                }}
                bordered
                dataSource={props.data}
                columns={mergedColumns}
                rowClassName="editable-row"
                pagination={{ onChange: cancel }}
            />
        </Form>
    );
}