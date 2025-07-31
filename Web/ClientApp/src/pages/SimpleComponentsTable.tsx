import React, {FC, ReactNode, useEffect, useState} from "react";
import {getEntities, MoneyDto} from "../ApiClient";
import {mapData} from "../SummaryTableMapper";
import {Money, SummaryTableHeader, SummaryTableRow} from "./SummaryTable";
import {DataIndexPath, EditableColumn, EditableColumnGroup, EditableTable} from "./EditableTable";
import {Space, Typography} from "antd";

const { Text } = Typography;

interface SimpleComponentsTableProps {
    apiPath: string,
    editable: boolean
}

const SimpleComponentsTable: FC<SimpleComponentsTableProps> = (props) => {
    const [isLoading, setIsLoading] = useState(true)
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
    })
    
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
    }
    
    let editable = props.editable
        ? {
            refreshData: async () => {
                const response = await getEntities(props.apiPath);
                return mapData(response.data)
            },
            onUpdate: updateEntity,
            onDelete: deleteEvaluations,
        }
        : undefined;

    function getValue(obj: any, path: (string | number)[]): any {
        return path.reduce((acc, key) => (acc != null ? acc[key] : undefined), obj);
    }

    const normalizePath = (path: DataIndexPath<SummaryTableRow>): (string | number)[] =>
        Array.isArray(path) ? path : [path as string];

    const formatAmount = (
        value: Money | undefined,
        colorCoding: boolean
    ) => {
        if (value === undefined) {
            return (
                <div style={{ cursor: 'pointer', textAlign: 'right' }}>
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
                <div style={{ cursor: 'pointer', color, textAlign: 'right' }}>
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
                    style={{ cursor: 'pointer', color, textAlign: 'right' }}>
                    {amount}
                </div>
            )
        }
    }

    function renderMoney(record: SummaryTableRow, dataIndex: DataIndexPath<SummaryTableRow>, colorCoding: boolean) : ReactNode {
        let value = getValue(record, normalizePath(dataIndex)) as MoneyDto

        return value 
            ? formatAmount(value, colorCoding) 
            : '???';

    }
    
    function buildComponentColumns (name: string, index: number) : (EditableColumn<SummaryTableRow> | EditableColumnGroup<SummaryTableRow>) {
        return {
            title: name,
            children: [
                {
                    title: 'Value',
                    dataIndex: ['components', index, 'value'],
                    editable: props.editable,
                    render: (record, path) => renderMoney(record, path, false)
                },
                {
                    title: 'Change',
                    dataIndex: ['components', index, 'change'],
                    editable: false,
                    render: (record, path) => renderMoney(record, path, true)
                },
                {
                    title: 'Cumulative',
                    dataIndex: ['components', index, 'cumulativeChange'],
                    editable: false,
                    render: (record, path) => renderMoney(record, path, true)
                }
            ]
        }
    }
    
    let componentsColumns = data.headers.map((header, index) => {
        return buildComponentColumns(header.name, index)
    })

    let columns : (EditableColumn<SummaryTableRow> | EditableColumnGroup<SummaryTableRow>)[] = [
        {
            title: 'Date',
            dataIndex: 'date',
            editable: false
        },
        ...componentsColumns,
        {
            title: 'Summary',
            children: [
                {
                    title: 'Value',
                    dataIndex: ['summary', 'value'],
                    editable: false,
                    render: (record, path) => renderMoney(record, path, false)
                },
                {
                    title: 'Change',
                    dataIndex: ['summary', 'change'],
                    editable: false,
                    render: (record, path) => renderMoney(record, path, true)
                },
                {
                    title: 'Cumulative',
                    dataIndex: ['summary', 'cumulativeChange'],
                    editable: false,
                    render: (record, path) => renderMoney(record, path, true)
                }
            ]
        }
    ];
    
    return isLoading
        ? <p><em>Loading...</em></p>
        : <EditableTable<SummaryTableRow>
            records={data.rows}
            columns={columns}
            onUpdate={(record, path, value) => {
                console.log('#Update', record, path, value)
            }}
            onDelete={record => {
                console.log('#Delete', record)
            }}
        />
}

export default SimpleComponentsTable;
