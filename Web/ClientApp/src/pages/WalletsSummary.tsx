import React from "react";
import {getWalletsValueHistory, setInflation} from "../api/value-history/Client";
import {DateGranularity} from "../api/value-history/DTOs/DateGranularity";
import MoneyPage from "./MoneyPage";

const WalletsSummary = () => {
    return (
        <MoneyPage
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