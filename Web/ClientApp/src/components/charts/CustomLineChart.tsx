import {
    CartesianGrid,
    Line,
    LineChart,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from "recharts";
import React, { useState, useMemo } from "react";
import { Checkbox } from "antd";
import { Formatter } from "recharts/types/component/DefaultTooltipContent";
import { getChartColor } from "./ChartColors";

interface CustomLineChartProps {
    series: Series[];
    xDataKey: string;
    yDataKey: string;
    yAxisFormatter?: (value: any, index: number) => string;
    tooltipFormatter?: Formatter<any, string>;
}

interface Series {
    name: string;
    data: { [key: string]: any }[];
}

const CustomLineChart: React.FC<CustomLineChartProps> = ({
                                                             series,
                                                             xDataKey,
                                                             yDataKey,
                                                             yAxisFormatter,
                                                             tooltipFormatter,
                                                         }) => {
    const [hiddenSeries, setHiddenSeries] = useState<string[]>([]);

    const mergedData = useMemo(() => {
        const dateMap: Record<string, any> = {};

        series.forEach((s) => {
            s.data.forEach((point) => {
                const date = point[xDataKey];
                if (!dateMap[date]) {
                    dateMap[date] = { [xDataKey]: date };
                }
                dateMap[date][s.name] = point[yDataKey];
            });
        });

        return Object.values(dateMap).sort(
            (a, b) => new Date(a[xDataKey]).getTime() - new Date(b[xDataKey]).getTime()
        );
    }, [series, xDataKey, yDataKey]);

    const toggleSeries = (seriesName: string) => {
        setHiddenSeries((prev) =>
            prev.includes(seriesName)
                ? prev.filter((name) => name !== seriesName)
                : [...prev, seriesName]
        );
    };

    return (
        <div style={{ position: "relative", width: "100%", height: 320, padding: 16 }}>
            {/* Chart */}
            <ResponsiveContainer width="100%" height="100%">
                <LineChart
                    data={mergedData}
                    margin={{ left: 40, right: 20, top: 20, bottom: 50 }} // bottom margin for legend space
                >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey={xDataKey} type="category" />
                    <YAxis tickFormatter={yAxisFormatter} />
                    <Tooltip formatter={tooltipFormatter} />

                    {series.map((s, idx) => (
                        <Line
                            key={s.name}
                            type="monotone"
                            dataKey={s.name}
                            name={s.name}
                            stroke={getChartColor(idx)}
                            dot={false}
                            hide={hiddenSeries.includes(s.name)}
                            isAnimationActive={true}
                            animationDuration={500}
                        />
                    ))}
                </LineChart>
            </ResponsiveContainer>

            {/* Checkbox Legend positioned at bottom-right */}
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
                }}
            >
                <Checkbox.Group
                    value={series
                        .map((s) => s.name)
                        .filter((name) => !hiddenSeries.includes(name))}
                    onChange={(checkedValues) => {
                        setHiddenSeries(
                            series
                                .map((s) => s.name)
                                .filter((name) => !checkedValues.includes(name))
                        );
                    }}
                    style={{ display: "flex", gap: 12 }}
                >
                    {series.map((s, idx) => (
                        <Checkbox
                            key={s.name}
                            value={s.name}
                            style={{ color: getChartColor(idx), userSelect: "none" }}
                        >
                            {s.name}
                        </Checkbox>
                    ))}
                </Checkbox.Group>
            </div>
        </div>
    );
};

export default CustomLineChart;
