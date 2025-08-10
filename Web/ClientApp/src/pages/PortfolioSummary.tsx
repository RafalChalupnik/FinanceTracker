import SimpleComponentsPage from "./SimpleComponentsPage";
import {DateGranularity} from "../api/value-history/DTOs/DateGranularity";
import {getPortfolioValueHistory} from "../api/value-history/Client";

const PortfolioSummary = () => {
    return <SimpleComponentsPage
        title='Portfolio Summary'
        defaultGranularity={DateGranularity.Month}
        getData={getPortfolioValueHistory}
        showInferredValues={false}
    />;
};

export default PortfolioSummary;
