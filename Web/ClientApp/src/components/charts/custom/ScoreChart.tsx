import {WalletValueHistoryRecordDto} from "../../../api/value-history/DTOs/EntityTableDto";
import React, {FC} from "react";
import {Typography} from "antd";
import Chart from "../Chart";

const {Title} = Typography;

interface ScoreChartProps {
    data: WalletValueHistoryRecordDto[],
}

const ScoreChart: FC<ScoreChartProps> = (props) => {
    let series = [
        {
            name: 'Change',
            data: props.data
                .map(dataPoint => {
                    return {
                        date: dataPoint.key,
                        value: dataPoint.yield.changePercent
                    }
                })
        },
        {
            name: 'Inflation',
            data: props.data
                .map(dataPoint => {
                    return {
                        date: dataPoint.key,
                        value: dataPoint.yield.inflation?.value
                    }
                })
        },
        {
            name: 'Total score',
            data: props.data
                .map(dataPoint => {
                    return {
                        date: dataPoint.key,
                        value: dataPoint.yield.totalChangePercent
                    }
                })
        }
    ]

    return (
        <>
            <Title level={5}>Total score</Title>
            <Chart
                series={series}
                xDataKey='date'
                yDataKey='value'
                yAxisFormatter={value => `${value.toFixed(2)}%`}
                tooltipFormatter={(value: any, name: string) => [`${value.toFixed(2)}%`, name]}
            />
        </>
    );
}

export default ScoreChart;