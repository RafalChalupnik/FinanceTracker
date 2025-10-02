import React, { useState } from 'react';
import {Form, Input, Popconfirm, Space, Table} from 'antd';
import type { FormRule } from 'antd';
import { ColumnType } from "antd/es/table";
import SaveCancelButtons from "../SaveCancelButtons";
import {DeleteOutlined, EditOutlined} from "@ant-design/icons";

export interface EditableColumnType<T> extends ColumnType<T> {
    editable?: boolean;
    renderEditor?: React.ReactNode;
    editorRules?: FormRule[];
}

interface EditableRowsTableProps<T> {
    data: T[];
    columns: EditableColumnType<T>[];
    onRowSave: (row: T) => void | Promise<void>;
    renderDeleteButton: (row: T) => React.ReactNode;
}

export function EditableRowsTable<T extends { key: React.Key }>(props: EditableRowsTableProps<T>) {
    const [form] = Form.useForm();
    const [editingKey, setEditingKey] = useState<React.Key>('');

    const isEditing = (record: T) => record.key === editingKey;

    const edit = (record: Partial<T> & { key: React.Key }) => {
        form.setFieldsValue(record);
        setEditingKey(record.key);
    };

    const cancel = () => {
        setEditingKey('');
    };

    const save = async (key: React.Key) => {
        try {
            const newValues = await form.validateFields() as Omit<T, 'key'>;
            const originalData = props.data.find(d => d.key === key);

            if (originalData) {
                await props.onRowSave({ ...originalData, ...newValues });
                setEditingKey('');
            }
        } catch (errInfo) {
            console.log('Validate Failed:', errInfo);
        }
    };

    const actionColumn: ColumnType<T> = {
        title: '',
        dataIndex: 'operation',
        fixed: 'right',
        render: (_: any, record: T) => {
            const editable = isEditing(record);
            return editable
                ? <SaveCancelButtons onSave={() => save(record.key)} onCancel={cancel} />
                : (
                    <Space direction='horizontal'>
                        <EditOutlined onClick={() => edit(record)} />
                        {props.renderDeleteButton(record)}
                    </Space>
                );
        },
    };

    const mergedColumns = props.columns.map((col): ColumnType<T> => {
        if (!col.editable || !col.dataIndex) {
            return col;
        }

        const originalRender = col.render;

        return {
            ...col,
            render: (text: any, record: T, index: number) => {
                const editing = isEditing(record);

                if (!editing) {
                    if (originalRender) {
                        return originalRender(text, record, index);
                    }
                    // --- THE FIX IS HERE ---
                    // It should return 'text' (the cell's value), not an undefined 'children' variable.
                    return text;
                }

                const editorNode = col.renderEditor ?? <Input />;
                return (
                    <Form.Item
                        name={col.dataIndex as string | string[]}
                        style={{ margin: 0 }}
                        rules={col.editorRules ?? [{ required: true, message: `Please input ${String(col.title || col.dataIndex)}!` }]}
                    >
                        {React.isValidElement(editorNode) ? React.cloneElement(editorNode as React.ReactElement) : editorNode}
                    </Form.Item>
                );
            }
        };
    });

    return (
        <Form form={form} component={false}>
            <Table<T>
                bordered
                dataSource={props.data}
                columns={[...mergedColumns, actionColumn]}
                rowKey="key"
                pagination={false}
            />
        </Form>
    );
}