import SimpleComponentsPage from "./SimpleComponentsPage";
import {DateGranularity, getWalletsValueHistory} from "../api/ValueHistoryApi";

const WalletsSummary = () => {
    return <SimpleComponentsPage
        title='Wallets Summary'
        defaultGranularity={DateGranularity.Month}
        getData={getWalletsValueHistory}
    />;
};

export default WalletsSummary;