import React, {FC} from "react";
import {ComponentHeader, ComponentValues, MoneyDto, ValueHistoryRecord} from "../api/ValueHistoryApi";
import {CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis} from "recharts";

interface MoneyChartProps {
    headers: ComponentHeader[],
    data: ValueHistoryRecord[],
    dataSelector: (record: ComponentValues) => MoneyDto,
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
                .filter(dataPoint => dataPoint.components[index] !== undefined)
                .map(dataPoint => {
                    return {
                        date: dataPoint.date,
                        value: props.dataSelector(dataPoint.components[index]!).amountInMainCurrency
                    }
                }
            )
        }
    })
    
    series.push({
        name: 'Total',
        data: props.data.map(dataPoint => {
            return {
                date: dataPoint.date,
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