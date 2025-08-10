import {FC, ReactNode} from "react";
import {Area, AreaChart, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis} from "recharts";
import {getChartColor} from "./ChartColors";
import {AxisDomain} from "recharts/types/util/types";
import {Formatter} from "recharts/types/component/DefaultTooltipContent";

interface CustomAreaChartProps {
    data: any[],
    xDataKey: string,
    yDataKeys: string[],
    domain?: AxisDomain,
    yAxisFormatter?: (value: any, index: number) => string,
    tooltipFormatter?: Formatter<any, string>
}

const CustomAreaChart: FC<CustomAreaChartProps> = (props) => {
    const buildGradientDefinition = (idx: number): ReactNode => {
        let color = getChartColor(idx);
        
        return (
            <linearGradient id={idx.toString()} x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={color} stopOpacity={0.8}/>
                <stop offset="95%" stopColor={color} stopOpacity={0.2}/>
            </linearGradient>
        );
    }
    
    return (
        <ResponsiveContainer width="100%" height={300} style={{padding: '16px'}}>
            <AreaChart data={props.data} width={500} height={300} margin={{ left: 40, right: 20, top: 20, bottom: 20 }}>
                {/* Gradient definitions */}
                <defs>
                    {props.yDataKeys.map((_, idx) => buildGradientDefinition(idx))}
                </defs>

                <XAxis
                    dataKey={props.xDataKey}
                    tick={{ fontSize: 12, fill: '#666' }}
                    type="category" allowDuplicatedCategory={false}
                />
                <YAxis
                    domain={props.domain}
                    tickFormatter={props.yAxisFormatter}
                    tick={{ fontSize: 12, fill: '#666' }}
                />
                <Tooltip formatter={props.tooltipFormatter} />
                <Legend />

                {props.yDataKeys.map((key, idx) => {
                    return (
                        <Area
                            type="basis"
                            dataKey={key}
                            stackId="1"
                            stroke={getChartColor(idx)}
                            fill={`url(#${idx})`}
                        />
                    );
                })}
            </AreaChart>
        </ResponsiveContainer>
    );
}

export default CustomAreaChart;