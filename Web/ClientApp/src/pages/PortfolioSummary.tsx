import {DateGranularity} from "../api/value-history/DTOs/DateGranularity";
import {getPortfolioValueHistory} from "../api/value-history/Client";
import React from "react";
import {EditableMoneyComponent} from "../components/money/EditableMoneyComponent";

const PortfolioSummary = () => (
    <EditableMoneyComponent
        title='Portfolio Summary'
        getData={getPortfolioValueHistory}
        showInferredValues={false}
        defaultGranularity={DateGranularity.Month}
    />
);

export default PortfolioSummary;
