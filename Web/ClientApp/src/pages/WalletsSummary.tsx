import {buildInflationColumn} from "../components/ColumnBuilder";
import dayjs, {Dayjs} from "dayjs";
import EmptyConfig from "../components/EmptyConfig";
import {EditableMoneyComponent} from "../components/EditableMoneyComponent";
import React, {FC, useEffect, useState} from "react";
import {CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis} from "recharts";
import {Typography} from "antd";
import {EntityColumnDto, WalletValueHistoryRecordDto} from "../api/value-history/DTOs/EntityTableDto";
import {getWalletsValueHistory, setInflation} from "../api/value-history/Client";
import {DateGranularity} from "../api/value-history/DTOs/DateGranularity";

const {Title} = Typography;

interface ScoreChartProps {
    data: WalletValueHistoryRecordDto[],
}

const ScoreChart: FC<ScoreChartProps> = (props) => {
    const chartLineColors = [
        '#1890ff',
        '#52c41a',
        '#f5222d'
    ];
    
    let series = [
        {
            name: 'Change (%)',
            data: props.data
                .map(dataPoint => {
                    return {
                        date: dataPoint.key,
                        value: dataPoint.yield.changePercent
                    }
                })
        },
        {
            name: 'Inflation (%)',
            data: props.data
                .map(dataPoint => {
                    return {
                        date: dataPoint.key,
                        value: dataPoint.yield.inflation
                    }
                })
        },
        {
            name: 'Total score (%)',
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
        <ResponsiveContainer width="100%" height={300} style={{padding: '16px'}}>
            <LineChart width={500} height={300} margin={{ left: 40, right: 20, top: 20, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" type="category" allowDuplicatedCategory={false} />
                <YAxis dataKey="value" />
                <Tooltip/>
                <Legend />
                {series.map((s, idx) => (
                    <Line
                        dataKey="value"
                        data={s.data}
                        name={s.name}
                        key={s.name}
                        stroke={chartLineColors[idx % chartLineColors.length]}
                    />
                ))}
            </LineChart>
        </ResponsiveContainer>
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