import React, {FC} from "react";
import {CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis} from "recharts";
import {EntityColumnDto, ValueHistoryRecordDto} from "../api/value-history/DTOs/EntityTableDto";
import {ValueSnapshotDto} from "../api/value-history/DTOs/ValueSnapshotDto";
import {MoneyDto} from "../api/value-history/DTOs/Money";

interface MoneyChartProps {
    headers: EntityColumnDto[],
    data: ValueHistoryRecordDto[],
    dataSelector: (record: ValueSnapshotDto) => MoneyDto,
}

const MoneyChart: FC<MoneyChartProps> = (props) => {
    const chartLineColors = [
        '#1890ff', 
        '#52c41a', 
        '#f5222d', 
        '#fa8c16', 
        '#722ed1',
        '#13c2c2'
    ];

    let series = props.headers.map((header, index) => {
        return {
            name: header.name,
            data: props.data
                .filter(dataPoint => dataPoint.entities[index] !== null)
                .map(dataPoint => {
                    return {
                        date: dataPoint.key,
                        value: props.dataSelector(dataPoint.entities[index]!).amountInMainCurrency
                    }
                }
            )
        }
    })
    
    series.push({
        name: 'Total',
        data: props.data.map(dataPoint => {
            return {
                date: dataPoint.key,
                value: props.dataSelector(dataPoint.summary!).amountInMainCurrency
            }
        })
    })

    let currencyFormatter = new Intl.NumberFormat('pl-PL', {
        style: 'currency',
        currency: 'PLN',
    })
    
    return (
        <ResponsiveContainer width="100%" height={300} style={{padding: '16px'}}>
            <LineChart width={500} height={300} margin={{ left: 40, right: 20, top: 20, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" type="category" allowDuplicatedCategory={false} />
                <YAxis dataKey="value" tickFormatter={currencyFormatter.format} />
                <Tooltip
                    formatter={(value: any, name: string) => [currencyFormatter.format(value), name]}
                />
                <Legend />
                {series.map((s, idx) => (
                    <Line
                        dataKey="value"
                        data={s.data}
                        name={s.name}
                        key={s.name}
                        stroke={chartLineColors[idx % chartLineColors.length]}
                    />
                ))}
            </LineChart>
        </ResponsiveContainer>
    );
}

export default MoneyChart;