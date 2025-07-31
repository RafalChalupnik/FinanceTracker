import React, { useState } from 'react';
import {
    Button,
    Form,
    Input,
    InputNumber,
    Popconfirm,
    Space,
    Table,
    TableProps
} from 'antd';
import type { ColumnsType } from 'antd/es/table';

export interface EditableColumn<T> {
    title: string;
    dataIndex: keyof T;
    editable?: boolean;
    render?: (value: any, record: T, index: number) => React.ReactNode;
}

export interface EditableTableProps<T extends { key: string }> {
    data: T[];
    columns: EditableColumn<T>[];
    onSave: (key: string, updated: Partial<T>) => Promise<void>;
    onDelete?: (key: string) => Promise<void>;
    onAdd?: () => void;
    addButtonText?: string;
}

const EditableTable = <T extends { key: string }>({
                                                      data,
                                                      columns,
                                                      onSave,
                                                      onDelete,
                                                      onAdd,
                                                      addButtonText = 'Add',
                                                  }: EditableTableProps<T>) => {
    const [form] = Form.useForm();
    const [editingKey, setEditingKey] = useState<string | null>(null);

    const isEditing = (record: T) => record.key === editingKey;

    const edit = (record: T) => {
        form.setFieldsValue({ ...record });
        setEditingKey(record.key);
    };

    const cancel = () => {
        setEditingKey(null);
    };

    const save = async (key: string) => {
        try {
            const row = await form.validateFields();
            await onSave(key, row);
            setEditingKey(null);
        } catch (err) {
            console.error('Validation failed:', err);
        }
    };

    const mergedColumns: ColumnsType<T> = columns.map(col => {
        if (!col.editable) return col as any;

        return {
            ...col,
            onCell: (record: T) => ({
                record,
                dataIndex: col.dataIndex,
                editing: isEditing(record),
            }),
        };
    });

    if (onDelete) {
        mergedColumns.push({
            title: 'Action',
            dataIndex: 'action',
            render: (_, record: T) => {
                const editable = isEditing(record);
                return editable ? (
                    <Space>
                        <Button type="link" onClick={() => save(record.key)}>
                            Save
                        </Button>
                        <Button type="link" onClick={cancel}>
                            Cancel
                        </Button>
                    </Space>
                ) : (
                    <Space>
                        <Button type="link" disabled={editingKey !== null} onClick={() => edit(record)}>
                            Edit
                        </Button>
                        <Popconfirm
                            title="Sure to delete?"
                            onConfirm={() => onDelete(record.key)}
                        >
                            <Button type="link" danger disabled={editingKey !== null}>
                                Delete
                            </Button>
                        </Popconfirm>
                    </Space>
                );
            },
        });
    }

    const EditableCell: React.FC<any> = ({
                                             editing,
                                             dataIndex,
                                             record,
                                             children,
                                             ...restProps
                                         }) => {
        return (
            <td {...restProps}>
                {editing ? (
                    <Form.Item
                        name={dataIndex}
                        style={{ margin: 0 }}
                        rules={[{ required: false }]}
                    >
                        {typeof record[dataIndex] === 'number' ? (
                            <InputNumber style={{ width: '100%' }} />
                        ) : (
                            <Input />
                        )}
                    </Form.Item>
                ) : (
                    children
                )}
            </td>
        );
    };

    return (
        <Form form={form} component={false}>
            <Space direction="vertical" style={{ width: '100%' }}>
                {onAdd && (
                    <Button onClick={onAdd} type="primary" style={{ marginBottom: 16 }}>
                        {addButtonText}
                    </Button>
                )}
                <Table
                    components={{
                        body: {
                            cell: EditableCell,
                        },
                    }}
                    bordered
                    dataSource={data}
                    columns={mergedColumns as ColumnsType<T>}
                    rowClassName="editable-row"
                    pagination={false}
                    rowKey="key"
                />
            </Space>
        </Form>
    );
};

export default EditableTable;
