import {Typography} from "antd";
import {ValueHistoryRecordDto} from "../../../api/value-history/DTOs/EntityTableDto";
import React, {FC} from "react";
import CustomLineChart from "../CustomLineChart";

const {Title} = Typography;

interface TargetChartProps {
    data: ValueHistoryRecordDto[]
}

const TargetChart: FC<TargetChartProps> = (props) => {
    let currencyFormatter = new Intl.NumberFormat('pl-PL', {
        style: 'currency',
        currency: 'PLN',
    })
    
    let series = [
        {
            name: 'Wallet',
            data: props.data
                .filter(dataPoint => dataPoint.target?.targetInMainCurrency !== undefined)
                .map(dataPoint => {
                    return {
                        date: dataPoint.key,
                        value: dataPoint.summary?.value.amountInMainCurrency
                    }
                })
        },
        {
            name: 'Target',
            data: props.data
                .filter(dataPoint => dataPoint.target?.targetInMainCurrency !== undefined)
                .map(dataPoint => {
                    return {
                        date: dataPoint.key,
                        value: dataPoint.target?.targetInMainCurrency
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
                yAxisFormatter={currencyFormatter.format}
                tooltipFormatter={(value: any, name: string) => [currencyFormatter.format(value), name]}
            />
        </>
    );
}

export default TargetChart;