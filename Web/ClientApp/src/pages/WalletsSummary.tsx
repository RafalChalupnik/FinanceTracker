import {
    ComponentHeader,
    DateGranularity,
    getWalletsValueHistory,
    setInflation,
    WalletHistoryRecord
} from "../api/ValueHistoryApi";
import {buildInflationColumn} from "../components/ColumnBuilder";
import dayjs, {Dayjs} from "dayjs";
import EmptyConfig from "../components/EmptyConfig";
import {EditableMoneyComponent} from "../components/EditableMoneyComponent";
import React, {useEffect, useState} from "react";

const WalletsSummary = () => {
    const [isLoading, setIsLoading] = useState(true)
    const [data, setData] = useState({
        headers: [] as ComponentHeader[],
        rows: [] as WalletHistoryRecord[]
    });

    const populateData = async (granularity?: DateGranularity, from?: Dayjs, to?: Dayjs) => {
        const response = await getWalletsValueHistory(granularity, from, to)
        setData({
            headers: response.headers,
            rows: response.data
        });

        setIsLoading(false)
    }

    useEffect(() => {
        populateData(DateGranularity.Month)
    }, [])
    
    const updateInflation = async (date: string, value: number) => {
        let updatedDate = dayjs(date).endOf('month')
        await setInflation(updatedDate.format("YYYY-MM-DD"), value);
        await populateData(DateGranularity.Month);
    }
    
    let extraColumns = [
        buildInflationColumn(updateInflation)
    ]
    
    return isLoading
        ? <p><em>Loading...</em></p>
        : <EmptyConfig enabled={data.headers.length === 0}>
            <EditableMoneyComponent
                title={'Wallets Summary'}
                rows={data.rows}
                columns={data.headers}
                refreshData={populateData}
                extraColumns={extraColumns}
            />
        </EmptyConfig>;
};

export default WalletsSummary;