import React, {FC} from "react";
import {Button, Input, Popconfirm, Space, Table} from "antd";
import type {ColumnGroupType, ColumnType} from "antd/es/table";
import {EditOutlined} from "@ant-design/icons";
import SaveCancelButtons from "../SaveCancelButtons";

interface DefaultEditableCellProps {
    initialValue: any | undefined;
    onSave: (value: any) => void | Promise<void>;
    onCancel: () => void;
}

const DefaultEditableCell : FC<DefaultEditableCellProps> = (props) => {
    let [currentValue, setCurrentValue] = React.useState<any>(props.initialValue);
    
    return (
        <Space direction='horizontal'>
            <Input
                value={currentValue}
                onChange={(e) => setCurrentValue(e.target.value)}
                onPressEnter={() => props.onSave(currentValue)}
                onBlur={() => props.onSave(currentValue)}
                // autoFocus
            />
            <SaveCancelButtons 
                onSave={() => props.onSave(currentValue)} 
                onCancel={props.onCancel}
            />
        </Space>
    );
}

interface ExtendableTableProps<T> {
    rows: T[];
    columns: (Column<T> | ColumnGroup<T>)[];
}

export interface Column<T> {
    key: string;
    title: string;
    fixed?: 'left' | 'right';
    render?: (row: T) => React.ReactNode;
    editable?: EditableColumn<T> | CustomEditableColumn<T>;
}

export interface ColumnGroup<T> {
    title: string;
    children: (Column<T> | ColumnGroup<T>)[];
}

export interface BaseEditableColumn {
    isEditable?: boolean;
}

export interface EditableColumn<T> extends BaseEditableColumn {
    initialValueSelector: (row: T) => any;
    onSave: (row: T, value: any) => void | Promise<void>;
}

export interface CustomEditableColumn<T> extends BaseEditableColumn {
    renderEditable: (row: T, closeCallback: () => void) => React.ReactNode;
}

export function ExtendableTable<T extends {key: React.Key}>(props: ExtendableTableProps<T>) {
    const [currentlyEditedColumn, setCurrentlyEditedColumn] = React.useState<string | undefined>(undefined);
    const [currentlyEditedRow, setCurrentlyEditedRow] = React.useState<React.Key | undefined>(undefined);
    
    const isCellBeingEdited = (rowKey: React.Key, column: string) => 
        currentlyEditedColumn == column && currentlyEditedRow == rowKey

    const setCurrentlyEditedCell = (rowKey: React.Key, columnKey: string) => {
        setCurrentlyEditedColumn(columnKey);
        setCurrentlyEditedRow(rowKey);
    }

    const clearCurrentlyEditedCell = () => {
        setCurrentlyEditedColumn(undefined);
        setCurrentlyEditedRow(undefined);
    }
    
    const renderCell = (
        row: T,
        columnKey: string,
        column: EditableColumn<T> | CustomEditableColumn<T>,
        renderFunc: () => any
    ) => {
        if (!isCellBeingEdited(row.key, columnKey)) {
            return (
                <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
                    <div style={{ flexGrow: 1, textAlign: 'inherit' }}>
                        {renderFunc()}
                    </div>
                    {(column.isEditable ?? true) && <Button icon={<EditOutlined />} style={{marginLeft: '5px'}} onClick={() => setCurrentlyEditedCell(row.key, columnKey)} />}
                </div>
            );
        }
        
        let editableColumn = column as EditableColumn<T>;
        let customEditableColumn = column as CustomEditableColumn<T>;
        
        console.log('#Editable', editableColumn)
        
        return customEditableColumn.renderEditable
            ? customEditableColumn.renderEditable(row, clearCurrentlyEditedCell)
            : <DefaultEditableCell 
                initialValue={editableColumn!.initialValueSelector(row)}
                onSave={async value => {
                    await editableColumn!.onSave!(row, value);
                    clearCurrentlyEditedCell();
                }} 
                onCancel={clearCurrentlyEditedCell}
            />
    }
    
    const buildColumns = (columns: (Column<T> | ColumnGroup<T>)[]) => {
        return columns.map((column): (ColumnType<T> | ColumnGroupType<T>) => {
            let columnGroup = column as ColumnGroup<T>

            if (columnGroup.children) {
                return {
                    title: column.title,
                    children: buildColumns(columnGroup.children),
                } as ColumnGroupType<T>;
            }

            let normalColumn = column as Column<T>;

            return {
                title: normalColumn.title,
                fixed: normalColumn.fixed,
                render: (_: any, row: T, index: number) => {
                    let renderFunc = () => normalColumn.render?.(row)
                        ?? (() => row);

                    return normalColumn.editable
                        ? renderCell(row, normalColumn.key, normalColumn.editable, renderFunc)
                        : renderFunc()
                }
            } as ColumnType<T>;
        })
    }
    
    let columns = buildColumns(props.columns);
    
    return (
        <Table
            bordered
            dataSource={props.rows}
            columns={columns}
            pagination={false}
            rowKey='key'
            scroll={{ x: 'max-content' }}
        />
    );
}