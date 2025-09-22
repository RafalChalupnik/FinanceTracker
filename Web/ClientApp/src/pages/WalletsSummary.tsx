import {buildInflationColumn} from "../components/table/ColumnBuilder";
import EditableMoneyComponent from "../components/money/EditableMoneyComponent";
import React from "react";
import {getWalletsValueHistory, setInflation} from "../api/value-history/Client";
import {DateGranularity} from "../api/value-history/DTOs/DateGranularity";
import ScoreChart from "../components/charts/custom/ScoreChart";

const WalletsSummary = () => {
    let buildExtraColumns = (granularity: DateGranularity, refreshCallback: () => Promise<void>) => [
        buildInflationColumn(granularity, async (year: number, month: number, value: number, confirmed: boolean) => {
            await setInflation(year, month, value, confirmed);
            await refreshCallback();
        })
    ]
    
    return (
        <EditableMoneyComponent
            title={'Wallets Summary'}
            getData={getWalletsValueHistory}
            showCompositionChart={true}
            showInferredValues={true}
            buildExtraColumns={buildExtraColumns}
            extra={data => (<ScoreChart data={data.rows}/>)}
            allowedGranularities={[
                DateGranularity.Month,
                DateGranularity.Quarter,
                DateGranularity.Year
            ]}
            defaultGranularity={DateGranularity.Month}
        />
    );
};

export default WalletsSummary;