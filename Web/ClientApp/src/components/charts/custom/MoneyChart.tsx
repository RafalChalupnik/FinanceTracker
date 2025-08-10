import React, {FC} from "react";
import {EntityColumnDto, ValueHistoryRecordDto} from "../../../api/value-history/DTOs/EntityTableDto";
import {ValueSnapshotDto} from "../../../api/value-history/DTOs/ValueSnapshotDto";
import {MoneyDto} from "../../../api/value-history/DTOs/Money";
import Chart from "../Chart";

interface MoneyChartProps {
    headers: EntityColumnDto[],
    data: ValueHistoryRecordDto[],
    dataSelector: (record: ValueSnapshotDto) => MoneyDto,
}

const MoneyChart: FC<MoneyChartProps> = (props) => {
    let series = props.headers.map((header, index) => {
        return {
            name: header.name,
            data: props.data
                .filter(dataPoint => dataPoint.entities[index] !== null)
                .map(dataPoint => {
                    return {
                        date: dataPoint.key,
                        value: props.dataSelector(dataPoint.entities[index]!).amountInMainCurrency
                    }
                }
            )
        }
    })
    
    series.push({
        name: 'Total',
        data: props.data.map(dataPoint => {
            return {
                date: dataPoint.key,
                value: props.dataSelector(dataPoint.summary!).amountInMainCurrency
            }
        })
    })

    let currencyFormatter = new Intl.NumberFormat('pl-PL', {
        style: 'currency',
        currency: 'PLN',
    })
    
    return (
        <Chart 
            series={series} 
            xDataKey='date' 
            yDataKey='value' 
            yAxisFormatter={currencyFormatter.format}
            tooltipFormatter={(value: any, name: string) => [currencyFormatter.format(value), name]}
        />
    );
}

export default MoneyChart;