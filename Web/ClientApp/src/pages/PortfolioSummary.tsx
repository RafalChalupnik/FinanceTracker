import SimpleComponentsPage from "./SimpleComponentsPage";
import {getPortfolioValueHistory} from "../api/ValueHistoryApi";

const PortfolioSummary = () => {
    return <SimpleComponentsPage
        title='Portfolio Summary'
        getData={getPortfolioValueHistory}
    />;
};

export default PortfolioSummary;
