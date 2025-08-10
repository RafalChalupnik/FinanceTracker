import {buildInflationColumn} from "../components/ColumnBuilder";
import {Dayjs} from "dayjs";
import EmptyConfig from "../components/EmptyConfig";
import {EditableMoneyComponent} from "../components/money/EditableMoneyComponent";
import React, {FC, useEffect, useState} from "react";
import {Typography} from "antd";
import {EntityColumnDto, WalletValueHistoryRecordDto} from "../api/value-history/DTOs/EntityTableDto";
import {getWalletsValueHistory, setInflation} from "../api/value-history/Client";
import {DateGranularity} from "../api/value-history/DTOs/DateGranularity";
import ScoreChart from "../components/charts/custom/ScoreChart";

const {Title} = Typography;

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
                extra={<ScoreChart data={data.rows}/>}
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