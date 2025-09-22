import {DateGranularity} from "../api/value-history/DTOs/DateGranularity";
import {getPortfolioValueHistory} from "../api/value-history/Client";
import React from "react";
import EditableMoneyComponent from "../components/money/EditableMoneyComponent";

const PortfolioSummary = () => {
    return (
        <EditableMoneyComponent
            title='Portfolio Summary'
            getData={getPortfolioValueHistory}
            showCompositionChart={false}
            showInferredValues={false}
            defaultGranularity={DateGranularity.Month}
        />
    );
};

export default PortfolioSummary;
