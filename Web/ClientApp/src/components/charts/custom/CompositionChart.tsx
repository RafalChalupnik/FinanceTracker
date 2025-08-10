import {EntityColumnDto, ValueHistoryRecordDto} from "../../../api/value-history/DTOs/EntityTableDto";
import React, {FC} from "react";
import CustomAreaChart from "../CustomAreaChart";
import {Typography} from "antd";

const {Title} = Typography;

interface CompositionChartProps {
    headers: EntityColumnDto[],
    records: ValueHistoryRecordDto[]
}

const CompositionChart: FC<CompositionChartProps> = (props) => {
    let yDataKeys = props.headers.map(header => header.name);
    
    let data = props.records
        .map(record => {
            let dataPoint: Record<string, string | number> = {};
            
            dataPoint['date'] = record.key;
            let totalValue = record.summary!.value.amountInMainCurrency!;
            
            for (let i = 0; i < yDataKeys.length; i++) {
                let name = yDataKeys[i];
                let value = record.entities[i]?.value?.amountInMainCurrency ?? 0;
                
                dataPoint[name] = value * 100 / totalValue;
            }
            
            return dataPoint
        })
    
    return (
        <>
            <Title level={5}>Composition</Title>
            <CustomAreaChart
                data={data}
                xDataKey={'date'}
                yDataKeys={yDataKeys}
                domain={[0, 100]}
                yAxisFormatter={value => `${value.toFixed(2)}%`}
                tooltipFormatter={(value: any, name: string) => [`${value.toFixed(2)}%`, name]}
            />
        </>
    );
}

export default CompositionChart;