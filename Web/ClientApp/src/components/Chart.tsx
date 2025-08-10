import {CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis} from "recharts";
import React from "react";
import {Formatter} from "recharts/types/component/DefaultTooltipContent";

interface ChartProps {
    series: Series[],
    xDataKey: string,
    yDataKey: string,
    yAxisFormatter?: (value: any, index: number) => string,
    tooltipFormatter?: Formatter<any, string>
}

interface Series {
    name: string,
    data: any
}

const Chart: React.FC<ChartProps> = (props) => {
    const chartLineColors = [
        '#1890ff',
        '#52c41a',
        '#f5222d',
        '#fa8c16',
        '#722ed1',
        '#13c2c2'
    ];

    return (
        <ResponsiveContainer width="100%" height={300} style={{padding: '16px'}}>
            <LineChart width={500} height={300} margin={{ left: 40, right: 20, top: 20, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey={props.xDataKey} type="category" allowDuplicatedCategory={false} />
                <YAxis dataKey={props.yDataKey} tickFormatter={props.yAxisFormatter} />
                <Tooltip formatter={props.tooltipFormatter}/>
                <Legend />
                {props.series.map((s, idx) => (
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

export default Chart;