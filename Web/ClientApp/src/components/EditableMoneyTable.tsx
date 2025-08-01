import React, {FC, ReactNode, useState} from "react";
import {DataIndexPath, EditableColumn, EditableColumnGroup, EditableTable} from "./EditableTable";
import {SummaryTableHeader, SummaryTableRow} from "../pages/SummaryTable";
import MoneyForm from "./MoneyForm";
import dayjs from "dayjs";
import {MoneyDto} from "../ApiClient";
import {Button, DatePicker, Modal, Space} from "antd";
import Money from "./Money";

interface MoneyEditableTableProps {
    rows: SummaryTableRow[]
    columns: SummaryTableHeader[]
    editable?: EditableProps
}

interface EditableProps {
    onUpdate: (id: string, date: string, value: MoneyDto) => Promise<void>
    onDelete: (date: string) => Promise<void>
} 

const EditableMoneyTable: FC<MoneyEditableTableProps> = (props) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);
    const [newEntryDate, setNewEntryDate] = useState<string | undefined>(undefined);

    function getValue(obj: any, path: (string | number)[]): any {
        return path.reduce((acc, key) => (acc != null ? acc[key] : undefined), obj);
    }

    const normalizePath = (path: DataIndexPath<SummaryTableRow>): (string | number)[] =>
        Array.isArray(path) ? path : [path as string];
    
    function renderMoney(record: SummaryTableRow, dataIndex: DataIndexPath<SummaryTableRow>, colorCoding: boolean) : ReactNode {
        return (
            <Money
                value={getValue(record, normalizePath(dataIndex)) as MoneyDto}
                colorCoding={colorCoding}
            />
        );
    }
    
    function buildComponentColumns (entityId: string, name: string, index: number) : (EditableColumn<SummaryTableRow> | EditableColumnGroup<SummaryTableRow>) {
        return {
            title: name,
            children: [
                {
                    title: 'Value',
                    key: entityId,
                    dataIndex: ['components', index, 'value'],
                    editable: props.editable !== undefined,
                    render: (record, path) => renderMoney(record, path, false)
                },
                {
                    title: 'Change',
                    key: entityId,
                    dataIndex: ['components', index, 'change'],
                    editable: false,
                    render: (record, path) => renderMoney(record, path, true)
                },
                {
                    title: 'Cumulative',
                    key: entityId,
                    dataIndex: ['components', index, 'cumulativeChange'],
                    editable: false,
                    render: (record, path) => renderMoney(record, path, true)
                }
            ]
        }
    }
    
    let componentsColumns = props.columns.map((header, index) => {
        return buildComponentColumns(header.id, header.name, index)
    })
    
    let columns : (EditableColumn<SummaryTableRow> | EditableColumnGroup<SummaryTableRow>)[] = [
        {
            title: 'Date',
            key: 'date',
            dataIndex: 'date',
            editable: false
        },
        ...componentsColumns,
        {
            title: 'Summary',
            children: [
                {
                    title: 'Value',
                    key: 'summary',
                    dataIndex: ['summary', 'value'],
                    editable: false,
                    render: (record, path) => renderMoney(record, path, false)
                },
                {
                    title: 'Change',
                    key: 'summary',
                    dataIndex: ['summary', 'change'],
                    editable: false,
                    render: (record, path) => renderMoney(record, path, true)
                },
                {
                    title: 'Cumulative',
                    key: 'summary',
                    dataIndex: ['summary', 'cumulativeChange'],
                    editable: false,
                    render: (record, path) => renderMoney(record, path, true)
                }
            ]
        }
    ];
    
    const handleModalOk = () => {
        if (!selectedDate) {
            console.warn("No date selected");
            return;
        }

        let date = dayjs(selectedDate).format('YYYY-MM-DD');
        setNewEntryDate(date)
        setIsModalOpen(false);
    };

    const handleModalCancel = () => {
        setIsModalOpen(false);
    };

    const buildData = () => {
        if (newEntryDate === undefined) {
            return props.rows;
        }

        let newData = [
            ...props.rows,
            {
                key: newEntryDate,
                date: newEntryDate,
                components: props.columns.map(_ => undefined),
                summary: undefined
            }
        ]

        return newData.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    }
    
    return (
        <>
            <Space direction={"vertical"}>
                <EditableTable<SummaryTableRow>
                    records={buildData()}
                    columns={columns}
                    renderEditableCell={(record, columnKey, initialValue, close) =>
                        <MoneyForm
                            initialValue={initialValue}
                            onSave={async money => {
                                await props.editable!.onUpdate(columnKey, dayjs(record.date).format('YYYY-MM-DD'), money);
                                setNewEntryDate(undefined);
                                close();
                            }}
                            onCancel={close}
                        />
                        
                    }
                    onDelete={async record => {
                        await props.editable!.onDelete(record.date)
                    }}
                />
                {props.editable && (
                    <Button onClick={() => setIsModalOpen(true)} type="primary" style={{ marginBottom: 16 }}>
                        Add a row
                    </Button>
                )}
            </Space>
            <Modal
                title="Pick a date"
                open={isModalOpen}
                onOk={handleModalOk}
                onCancel={handleModalCancel}
            >
                <DatePicker onChange={setSelectedDate} />
            </Modal>
        </>
    );
}

export default EditableMoneyTable;