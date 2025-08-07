import React, {ReactNode, useState} from "react";
import {Table, Popconfirm, Input, Space, Button} from "antd";
import type {ColumnGroupType, ColumnsType, ColumnType} from "antd/es/table";
import {CloseOutlined, DeleteOutlined, SaveOutlined} from "@ant-design/icons";

export type DataIndexPath<T> = keyof T | (string | number)[];

interface EditableTableProps<T extends { key: React.Key }> {
    records: T[];
    columns: (EditableColumn<T> | EditableColumnGroup<T>)[];
    renderEditableCell?: (record: T, columnKey: string, initialValue: any, close: () => void) => ReactNode;
    onUpdate?: (record: T, path: DataIndexPath<T>, value: any) => void;
    onDelete?: (record: T) => void;
}

export interface EditableColumn<T> {
    title: string;
    key: string;
    dataIndex: DataIndexPath<T>;
    editable: boolean;
    fixed?: 'left' | 'right';
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
        props.onUpdate!(record, path, editingValue);
        setEditingKey(null);
    };

    const renderEditableCell = (
        record: T, 
        path: DataIndexPath<T>, 
        columnKey: string,
        renderFunc: () => ReactNode
    ) => {
        if (!isEditing(record, path)) {
            return (
                <div onDoubleClick={() => handleEdit(record, path)}>
                    {renderFunc()}
                </div>
            );
        }
        
        return props.renderEditableCell
            ? props.renderEditableCell(record, columnKey, editingValue, () => setEditingKey(null))
            : (
                <Space direction='horizontal'>
                    <Input
                        value={editingValue}
                        onChange={(e) => setEditingValue(e.target.value)}
                        onPressEnter={() => handleSave(record, path)}
                        onBlur={() => handleSave(record, path)}
                        // autoFocus
                    />
                    <Button 
                        icon={<SaveOutlined />} 
                        onClick={() => handleSave(record, path)}
                    />
                    <Button 
                        icon={<CloseOutlined />} 
                        onClick={() => setEditingKey(null)}
                    />
                </Space>
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
                fixed: normalColumn.fixed,
                render: (_: any, record: T, index: number) => {
                    let renderFunc = () => normalColumn.render?.(record, normalColumn.dataIndex) 
                        ?? getValue(record, normalizePath(normalColumn.dataIndex));
                    
                    return normalColumn.editable
                        ? renderEditableCell(record, normalColumn.dataIndex, normalColumn.key, renderFunc)
                        : renderFunc()
                },
            } as ColumnType<T>;
        });
    };
    
    const tableColumns = processColumns(props.columns);
    
    if (props.onDelete !== undefined) {
        tableColumns.push({
            title: '',
            dataIndex: 'operation',
            fixed: 'right',
            render: (_: any, record: T) => (
                <Popconfirm
                    title='Sure to delete?'
                    okText={'Yes'}
                    cancelText={'No'}
                    okButtonProps={{ danger: true }}
                    onConfirm={() => props.onDelete!(record)}
                >
                    <DeleteOutlined />
                </Popconfirm>
            ),
        });
    }

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
