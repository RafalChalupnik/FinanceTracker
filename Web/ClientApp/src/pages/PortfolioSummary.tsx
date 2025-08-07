import SimpleComponentsPage from "./SimpleComponentsPage";
import {DateGranularity, getPortfolioValueHistory} from "../api/ValueHistoryApi";

const PortfolioSummary = () => {
    return <SimpleComponentsPage
        title='Portfolio Summary'
        defaultGranularity={DateGranularity.Month}
        getData={getPortfolioValueHistory}
    />;
};

export default PortfolioSummary;
