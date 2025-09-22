import EditableMoneyComponent from "../components/money/EditableMoneyComponent";
import React from "react";
import {getWalletsValueHistory, setInflation} from "../api/value-history/Client";
import {DateGranularity} from "../api/value-history/DTOs/DateGranularity";
import ScoreChart from "../components/charts/custom/ScoreChart";

const WalletsSummary = () => {
    return (
        <EditableMoneyComponent
            title={'Wallets Summary'}
            getData={getWalletsValueHistory}
            showCompositionChart={true}
            showInferredValues={true}
            setInflation={setInflation}
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