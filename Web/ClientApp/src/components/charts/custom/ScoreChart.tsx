import {ValueHistoryRecordDto} from "../../../api/value-history/DTOs/EntityTableDto";
import React, {FC} from "react";
import {Typography} from "antd";
import CustomLineChart from "../CustomLineChart";

const {Title} = Typography;

interface ScoreChartProps {
    data: ValueHistoryRecordDto[],
}

const ScoreChart: FC<ScoreChartProps> = (props) => {
    let series = [
        {
            name: 'Change',
            data: props.data
                .map(dataPoint => {
                    return {
                        date: dataPoint.key,
                        value: dataPoint.score?.changePercent
                    }
                })
        },
        {
            name: 'Inflation',
            data: props.data
                .map(dataPoint => {
                    return {
                        date: dataPoint.key,
                        value: dataPoint.score?.inflation?.value
                    }
                })
        },
        {
            name: 'Total score',
            data: props.data
                .map(dataPoint => {
                    return {
                        date: dataPoint.key,
                        value: dataPoint.score?.totalChangePercent
                    }
                })
        }
    ]

    return (
        <>
            <Title level={5}>Total score</Title>
            <CustomLineChart
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