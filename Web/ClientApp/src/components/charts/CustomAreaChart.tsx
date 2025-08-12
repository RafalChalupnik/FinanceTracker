import { FC, ReactNode, useState } from "react";
import {
    Area,
    AreaChart,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from "recharts";
import { Checkbox } from "antd";
import { getChartColor } from "./ChartColors";
import { AxisDomain } from "recharts/types/util/types";
import { Formatter } from "recharts/types/component/DefaultTooltipContent";

interface CustomAreaChartProps {
    data: any[];
    xDataKey: string;
    yDataKeys: string[];
    domain?: AxisDomain;
    yAxisFormatter?: (value: any, index: number) => string;
    tooltipFormatter?: Formatter<any, string>;
}

const CustomAreaChart: FC<CustomAreaChartProps> = (props) => {
    const [hiddenKeys, setHiddenKeys] = useState<string[]>([]);

    const buildGradientDefinition = (idx: number): ReactNode => {
        let color = getChartColor(idx);

        return (
            <linearGradient id={idx.toString()} x1="0" y1="0" x2="0" y2="1" key={idx}>
                <stop offset="5%" stopColor={color} stopOpacity={0.8} />
                <stop offset="95%" stopColor={color} stopOpacity={0.2} />
            </linearGradient>
        );
    };

    // Toggle visibility of a key
    const toggleKey = (key: string) => {
        setHiddenKeys((prev) =>
            prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]
        );
    };

    return (
        <div style={{ position: "relative", width: "100%", height: 320, padding: 16 }}>
            <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                    data={props.data}
                    margin={{ left: 40, right: 20, top: 20, bottom: 50 }} // bottom margin for legend
                >
                    <defs>{props.yDataKeys.map((_, idx) => buildGradientDefinition(idx))}</defs>

                    <XAxis
                        dataKey={props.xDataKey}
                        tick={{ fontSize: 12, fill: "#666" }}
                        type="category"
                        allowDuplicatedCategory={false}
                    />
                    <YAxis
                        domain={props.domain}
                        tickFormatter={props.yAxisFormatter}
                        tick={{ fontSize: 12, fill: "#666" }}
                    />
                    <Tooltip formatter={props.tooltipFormatter} />

                    {props.yDataKeys.map((key, idx) => (
                        <Area
                            key={key}
                            type="basis"
                            dataKey={key}
                            stackId="1"
                            stroke={getChartColor(idx)}
                            fill={`url(#${idx})`}
                            hide={hiddenKeys.includes(key)}
                            isAnimationActive={true}
                            animationDuration={500}
                        />
                    ))}
                </AreaChart>
            </ResponsiveContainer>

            {/* Checkbox legend in bottom-right */}
            <div
                style={{
                    position: "absolute",
                    bottom: 16,
                    right: 24,
                    background: "rgba(255, 255, 255, 0.95)",
                    padding: "6px 12px",
                    borderRadius: 6,
                    boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
                    userSelect: "none",
                    display: "flex",
                    gap: 12,
                    zIndex: 100,
                    flexWrap: "wrap",
                    maxWidth: "calc(100% - 48px)", // prevent overflow
                }}
            >
                <Checkbox.Group
                    value={props.yDataKeys.filter((key) => !hiddenKeys.includes(key))}
                    onChange={(checkedValues) => {
                        setHiddenKeys(
                            props.yDataKeys.filter(
                                (key) => !checkedValues.includes(key as string)
                            )
                        );
                    }}
                    style={{ display: "flex", gap: 12, flexWrap: "wrap" }}
                >
                    {props.yDataKeys.map((key, idx) => (
                        <Checkbox
                            key={key}
                            value={key}
                            style={{ color: getChartColor(idx), userSelect: "none" }}
                        >
                            {key}
                        </Checkbox>
                    ))}
                </Checkbox.Group>
            </div>
        </div>
    );
};

export default CustomAreaChart;
