import EditableMoneyComponent from "../components/money/EditableMoneyComponent";
import React from "react";
import {getWalletsValueHistory, setInflation} from "../api/value-history/Client";
import {DateGranularity} from "../api/value-history/DTOs/DateGranularity";

const WalletsSummary = () => {
    return (
        <EditableMoneyComponent
            title={'Wallets Summary'}
            getData={getWalletsValueHistory}
            showCompositionChart={true}
            showInferredValues={true}
            setInflation={setInflation}
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