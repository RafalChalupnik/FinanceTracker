import React, {FC, ReactNode, useEffect, useState} from "react";
import {getEntities, MoneyDto} from "../ApiClient";
import {mapData} from "../SummaryTableMapper";
import {SummaryTableHeader, SummaryTableRow} from "./SummaryTable";
import {DataIndexPath, EditableColumn, EditableColumnGroup, EditableTable} from "./EditableTable";
import Money from "../components/Money";
import MoneyForm from "../components/MoneyForm";
import dayjs from "dayjs";
import {Button, DatePicker, Modal, Space} from "antd";

interface SimpleComponentsTableProps {
    apiPath: string,
    editable: boolean
}

const SimpleComponentsTable: FC<SimpleComponentsTableProps> = (props) => {
    const [isLoading, setIsLoading] = useState(true)
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);
    const [data, setData] = useState({
        headers: [] as SummaryTableHeader[],
        rows: [] as SummaryTableRow[]
    });

    const populateData = async () => {
        const response = await getEntities(props.apiPath);

        let headers: SummaryTableHeader[] = response.headers
        let data = mapData(response.data)
        
        setData({
            headers: headers,
            rows: data
        });
        
        setIsLoading(false)
    }
    
    useEffect(() => {
        populateData()
    }, [])
    
    const updateEntity = async (id: string, date: string, value: MoneyDto) => {
        const response = await fetch(`${props.apiPath}/` + id, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                date: date,
                value: value
            }),
        });

        if (!response.ok) {
            throw new Error(`Response status: ${response.status}`);
        }

        await populateData()
    }

    const deleteEvaluations = async (date: string) => {
        const response = await fetch(`${props.apiPath}/` + date, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
            }
        });

        if (!response.ok) {
            throw new Error(`Response status: ${response.status}`);
        }
        
        await populateData()
    }
    
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
                    editable: props.editable,
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
    
    let componentsColumns = data.headers.map((header, index) => {
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

    const handleAdd = () => {
        setIsModalOpen(true);
    };

    const handleModalOk = () => {
        if (!selectedDate) {
            console.warn("No date selected");
            return;
        }
        
        let date = dayjs(selectedDate).format('YYYY-MM-DD');
        
        let newRows = [
            ...data.rows,
            {
                key: date,
                date: date,
                components: data.headers.map(_ => undefined),
                summary: undefined
            } as SummaryTableRow
        ]

        console.log('Rows:', newRows);
        
        let newData = {
            headers: data.headers,
            rows: newRows.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
        }
        
        setData(newData);
        setIsModalOpen(false);
    };

    const handleModalCancel = () => {
        setIsModalOpen(false);
    };
    
    return isLoading
        ? <p><em>Loading...</em></p>
        : <>
            <Space direction={"vertical"}>
                <EditableTable<SummaryTableRow>
                    records={data.rows}
                    columns={columns}
                    renderEditableCell={(record, columnKey, initialValue, close) =>
                        <MoneyForm
                            initialValue={initialValue}
                            onSave={async money => {
                                await updateEntity(columnKey, dayjs(record.date).format('YYYY-MM-DD'), money);
                                close();
                            }}
                            onCancel={close}
                        />
                    }
                    onDelete={async record => {
                        await deleteEvaluations(dayjs(record.date).format('YYYY-MM-DD'))
                    }}
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
                onOk={handleModalOk}
                onCancel={handleModalCancel}
            >
                <DatePicker onChange={setSelectedDate} />
            </Modal>
        </>
}

export default SimpleComponentsTable;
