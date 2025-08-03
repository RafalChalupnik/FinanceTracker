import React, {FC} from "react";
import {ComponentHeader, ValueHistoryRecord} from "../api/ValueHistoryApi";
import {CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis} from "recharts";

interface MoneyChartProps {
    headers: ComponentHeader[],
    data: ValueHistoryRecord[]
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
            data: props.data.map(dataPoint => {
                return {
                    date: dataPoint.date,
                    value: dataPoint.components[index]?.value.amountInMainCurrency ?? 0
                }
            })
        }
    })
    
    return (
        <ResponsiveContainer width="100%" height={300}>
            <LineChart width={500} height={300}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" type="category" allowDuplicatedCategory={false} />
                <YAxis dataKey="value" />
                <Tooltip />
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