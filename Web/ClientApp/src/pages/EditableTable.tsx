import React, {ReactNode, useState} from "react";
import { Table, Input, Button, Popconfirm } from "antd";
import type {ColumnGroupType, ColumnsType, ColumnType} from "antd/es/table";
import {DeleteOutlined} from "@ant-design/icons";

export type DataIndexPath<T> = keyof T | (string | number)[];

interface EditableTableProps<T extends { key: React.Key }> {
    records: T[];
    columns: (EditableColumn<T> | EditableColumnGroup<T>)[];
    onUpdate: (record: T, path: DataIndexPath<T>, value: any) => void;
    onDelete: (record: T) => void;
}

export interface EditableColumn<T> {
    title: string;
    dataIndex: DataIndexPath<T>;
    editable: boolean;
    render?: (record: T, dataIndex: DataIndexPath<T>) => React.ReactNode;
}

export interface EditableColumnGroup<T> {
    title: string;
    children: (EditableColumn<T> | EditableColumnGroup<T>)[];
}

export function EditableTable<T extends { key: React.Key }>(props: EditableTableProps<T>) {
    const [editingKey, setEditingKey] = useState<string | null>(null);
    const [editingValue, setEditingValue] = useState<any>("");

    function getValue(obj: any, path: (string | number)[]): any {
        return path.reduce((acc, key) => (acc != null ? acc[key] : undefined), obj);
    }
    
    const normalizePath = (path: DataIndexPath<T>): (string | number)[] =>
        Array.isArray(path) ? path : [path as string];

    const getKeyFromPath = (recordKey: React.Key, path: DataIndexPath<T>) =>
        `${recordKey}-${normalizePath(path).join(".")}`;

    const isEditing = (record: T, path: DataIndexPath<T>) =>
        editingKey === getKeyFromPath(record.key, path);

    const handleEdit = (record: T, path: DataIndexPath<T>) => {
        const value = getValue(record, normalizePath(path));
        setEditingKey(getKeyFromPath(record.key, path));
        setEditingValue(value);
    };

    const handleSave = (record: T, path: DataIndexPath<T>) => {
        props.onUpdate(record, path, editingValue);
        setEditingKey(null);
    };

    const renderEditableCell = (record: T, path: DataIndexPath<T>, renderFunc: () => ReactNode) => {
        if (!isEditing(record, path)) {
            return (
                <div onClick={() => handleEdit(record, path)}>
                    {renderFunc()}
                </div>
            );
        }

        return (
            <Input
                value={editingValue}
                onChange={(e) => setEditingValue(e.target.value)}
                onPressEnter={() => handleSave(record, path)}
                onBlur={() => handleSave(record, path)}
                autoFocus
            />
        );
    };

    const processColumns = (
        columns: (EditableColumn<T> | EditableColumnGroup<T>)[]
    ) => {
        return columns.map((column) : (ColumnType<T> | ColumnGroupType<T>) => {
            let groupColumn = column as EditableColumnGroup<T>
            
            if (groupColumn.children) {
                return {
                    title: column.title,
                    children: processColumns(groupColumn.children),
                };
            }
            
            let normalColumn = column as EditableColumn<T>

            return {
                title: normalColumn.title,
                dataIndex: normalColumn.dataIndex,
                fixed: 'left',
                render: (_: any, record: T, index: number) => {
                    let renderFunc = () => normalColumn.render?.(record, normalColumn.dataIndex) 
                        ?? getValue(record, normalizePath(normalColumn.dataIndex));
                    
                    return normalColumn.editable
                        ? renderEditableCell(record, normalColumn.dataIndex, renderFunc)
                        : renderFunc()
                },
            } as ColumnType<T>;
        });
    };

    const tableColumns: ColumnsType<T> = [
        ...processColumns(props.columns),
        {
            title: '',
            dataIndex: 'operation',
            fixed: 'left',
            render: (_: any, record: T) => (
                <Popconfirm
                    title='Sure to delete?'
                    okText={'Yes'}
                    cancelText={'No'}
                    okButtonProps={{ danger: true }}
                    onConfirm={() => props.onDelete(record)}
                >
                    <DeleteOutlined />
                </Popconfirm>
            ),
        },
    ];

    return (
        <Table
            bordered
            dataSource={props.records}
            columns={tableColumns}
            pagination={false}
            rowKey="key"
            scroll={{ x: 'max-content' }}
        />
    );
}
