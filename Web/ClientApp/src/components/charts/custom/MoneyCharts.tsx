import React, {FC} from "react";
import {EntityColumnDto, ValueHistoryRecordDto} from "../../../api/value-history/DTOs/EntityTableDto";
import {ValueSnapshotDto} from "../../../api/value-history/DTOs/ValueSnapshotDto";
import {MoneyDto} from "../../../api/value-history/DTOs/Money";
import CustomLineChart from "../CustomLineChart";
import {Typography} from "antd";

const { Title } = Typography;

interface MoneyChartsProps {
    headers: EntityColumnDto[],
    data: ValueHistoryRecordDto[]
}

const MoneyCharts: FC<MoneyChartsProps> = (props) => {
    const buildSeries = (dataSelector: (record: ValueSnapshotDto) => MoneyDto) => {
        let series = props.headers.map((header, index) => {
            return {
                name: header.name,
                data: props.data
                    .filter(dataPoint => dataPoint.entities[index] !== null)
                    .map(dataPoint => {
                        return {
                            date: dataPoint.key,
                            value: dataSelector(dataPoint.entities[index]!).amountInMainCurrency
                        }
                    }
                )
            }
        });

        series.push({
            name: 'Total',
            data: props.data.map(dataPoint => {
                return {
                    date: dataPoint.key,
                    value: dataSelector(dataPoint.summary!).amountInMainCurrency
                }
            })
        })
        
        return series;
    }
    
    let currencyFormatter = new Intl.NumberFormat('pl-PL', {
        style: 'currency',
        currency: 'PLN',
    })
    
    const buildChart = (title: string, dataSelector: (record: ValueSnapshotDto) => MoneyDto) => (
        <>
            <Title level={5}>{title}</Title>
            <CustomLineChart
                series={buildSeries(dataSelector)}
                xDataKey='date'
                yDataKey='value'
                yAxisFormatter={currencyFormatter.format}
                tooltipFormatter={(value: any, name: string) => [currencyFormatter.format(value), name]}
            />
        </>
    );
    
    return (
        <>
            {buildChart('Value', record => record.value)}
            {buildChart('Change', record => record.change)}
            {buildChart('Cumulative change', record => record.cumulativeChange)}
        </>
    );
}

export default MoneyCharts;