import React, { useState } from "react";
import { Table, Input, Button, Popconfirm } from "antd";
import type {ColumnGroupType, ColumnsType, ColumnType} from "antd/es/table";

export type DataIndexPath<T> = keyof T | (string | number)[];

export interface EditableColumn<T> {
    title: string;
    dataIndex?: DataIndexPath<T>;
    editable?: boolean;
    children?: EditableColumn<T>[];
    render?: (value: any, record: T, index: number) => React.ReactNode;
}

interface EditableTableProps<T extends { key: React.Key }> {
    records: T[];
    columns: EditableColumn<T>[];
    onUpdate: (record: T, path: DataIndexPath<T>, value: any) => void;
    onDelete: (record: T) => void;
}

// Helpers to read/write nested paths without lodash
function getValue(obj: any, path: (string | number)[]): any {
    return path.reduce((acc, key) => (acc != null ? acc[key] : undefined), obj);
}

function setValue(obj: any, path: (string | number)[], value: any): any {
    const newObj = { ...obj };
    let current = newObj;
    for (let i = 0; i < path.length - 1; i++) {
        const key = path[i];
        current[key] = { ...(current[key] || {}) };
        current = current[key];
    }
    current[path[path.length - 1]] = value;
    return newObj;
}

export function EditableTable<T extends { key: React.Key }>({
                                                                records,
                                                                columns,
                                                                onUpdate,
                                                                onDelete,
                                                            }: EditableTableProps<T>) {
    const [editingKey, setEditingKey] = useState<string | null>(null);
    const [editingValue, setEditingValue] = useState<any>("");

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
        onUpdate(record, path, editingValue);
        setEditingKey(null);
    };

    const renderEditableCell = (record: T, path: DataIndexPath<T>) => {
        if (!isEditing(record, path)) {
            const value = getValue(record, normalizePath(path));
            return (
                <div onClick={() => handleEdit(record, path)}>
                    {String(value)}
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
        cols: EditableColumn<T>[]
    ) => {
        return cols.map((col) : (ColumnType<T> | ColumnGroupType<T>) => {
            if (col.children) {
                return {
                    ...col,
                    children: processColumns(col.children),
                };
            }

            return {
                title: col.title,
                dataIndex: col.dataIndex,
                render: (value: any, record: T, index: number) => {
                    return col.editable
                        ? renderEditableCell(record, col.dataIndex!)
                        : col.render?.(value, record, index) ?? getValue(record, normalizePath(col.dataIndex!));
                },
            } as ColumnType<T>;
        });
    };

    const tableColumns: ColumnsType<T> = [
        ...processColumns(columns),
        {
            title: "Actions",
            dataIndex: "actions",
            render: (_: any, record: T) => (
                <Popconfirm
                    title="Are you sure you want to delete this row?"
                    onConfirm={() => onDelete(record)}
                >
                    <Button danger size="small">Delete</Button>
                </Popconfirm>
            ),
        },
    ];

    return (
        <Table<T>
            rowKey="key"
            columns={tableColumns}
            dataSource={records}
            pagination={false}
        />
    );
}
