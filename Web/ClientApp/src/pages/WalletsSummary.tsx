import {buildInflationColumn} from "../components/ColumnBuilder";
import {Dayjs} from "dayjs";
import EmptyConfig from "../components/EmptyConfig";
import {EditableMoneyComponent} from "../components/EditableMoneyComponent";
import React, {FC, useEffect, useState} from "react";
import {Typography} from "antd";
import {EntityColumnDto, WalletValueHistoryRecordDto} from "../api/value-history/DTOs/EntityTableDto";
import {getWalletsValueHistory, setInflation} from "../api/value-history/Client";
import {DateGranularity} from "../api/value-history/DTOs/DateGranularity";
import Chart from "../components/Chart";

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

const WalletsSummary = () => {
    const [isLoading, setIsLoading] = useState(true)
    const [data, setData] = useState({
        headers: [] as EntityColumnDto[],
        rows: [] as WalletValueHistoryRecordDto[]
    });

    const populateData = async (granularity?: DateGranularity, from?: Dayjs, to?: Dayjs) => {
        const response = await getWalletsValueHistory(granularity, from, to)
        setData({
            headers: response.columns,
            rows: response.rows
        });

        setIsLoading(false)
    }

    useEffect(() => {
        populateData(DateGranularity.Month)
    }, [])
    
    const updateInflation = async (year: number, month: number, value: number, confirmed: boolean) => {
        await setInflation(year, month, value, confirmed);
        await populateData(DateGranularity.Month);
    }
    
    let buildExtraColumns = (granularity: DateGranularity) => [
        buildInflationColumn(granularity, updateInflation)
    ]
    
    return isLoading
        ? <p><em>Loading...</em></p>
        : <EmptyConfig enabled={data.headers.length === 0}>
            <EditableMoneyComponent
                title={'Wallets Summary'}
                rows={data.rows}
                columns={data.headers}
                refreshData={populateData}
                buildExtraColumns={buildExtraColumns}
                extra={
                    <>
                        <Title level={5}>Total score</Title>
                        <ScoreChart data={data.rows}/>
                    </>
                }
                allowedGranularities={[
                    DateGranularity.Month,
                    DateGranularity.Quarter,
                    DateGranularity.Year
                ]}
                defaultGranularity={DateGranularity.Month}
            />
        </EmptyConfig>;
};

export default WalletsSummary;