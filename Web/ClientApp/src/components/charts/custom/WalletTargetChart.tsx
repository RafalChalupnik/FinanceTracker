import {Typography} from "antd";
import {WalletComponentsValueHistoryRecordDto} from "../../../api/value-history/DTOs/EntityTableDto";
import React, {FC} from "react";
import CustomLineChart from "../CustomLineChart";

const {Title} = Typography;

interface WalletTargetChartProps {
    data: WalletComponentsValueHistoryRecordDto[]
}

const WalletTargetChart: FC<WalletTargetChartProps> = (props) => {
    let series = [
        {
            name: 'Wallet',
            data: props.data
                .filter(dataPoint => dataPoint.target?.percentage !== undefined)
                .map(dataPoint => {
                    return {
                        date: dataPoint.key,
                        value: dataPoint.target?.percentage
                    }
                })
        },
        {
            name: 'Target',
            data: props.data
                .filter(dataPoint => dataPoint.target?.percentage !== undefined)
                .map(dataPoint => {
                    return {
                        date: dataPoint.key,
                        value: 100
                    }
                })
        }
    ]

    return (
        <>
            <Title level={5}>Target</Title>
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

export default WalletTargetChart;