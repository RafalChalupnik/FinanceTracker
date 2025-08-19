import {DateGranularity} from "../api/value-history/DTOs/DateGranularity";
import {getPortfolioValueHistory} from "../api/value-history/Client";
import React, {useEffect, useState} from "react";
import {EntityColumnDto, ValueHistoryRecordDto} from "../api/value-history/DTOs/EntityTableDto";
import {Dayjs} from "dayjs";
import EmptyConfig from "../components/EmptyConfig";
import {EditableMoneyComponent} from "../components/money/EditableMoneyComponent";

const PortfolioSummary = () => {
    const DEFAULT_GRANULARITY = DateGranularity.Month;
    
    const [data, setData] = useState({
        headers: [] as EntityColumnDto[],
        rows: [] as ValueHistoryRecordDto[]
    });

    const populateData = async (granularity?: DateGranularity, from?: Dayjs, to?: Dayjs) => {
        const response = await getPortfolioValueHistory(granularity, from, to);
        setData({
            headers: response.columns,
            rows: response.rows
        });
    }

    useEffect(() => {
        populateData(DEFAULT_GRANULARITY);
    }, []);

    return (
        <EmptyConfig enabled={data.headers.length === 0}>
            <EditableMoneyComponent
                title='Portfolio Summary'
                rows={data.rows}
                columns={data.headers}
                refreshData={populateData}
                showInferredValues={false}
                defaultGranularity={DEFAULT_GRANULARITY}
            />
        </EmptyConfig>
    );
};

export default PortfolioSummary;
