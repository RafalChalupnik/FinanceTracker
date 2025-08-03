import SimpleComponentsPage from "./SimpleComponentsPage";
import {getWalletsValueHistory} from "../api/ValueHistoryApi";

const WalletsSummary = () => {
    return <SimpleComponentsPage
        title='Wallets Summary'
        getData={getWalletsValueHistory}
    />;
};

export default WalletsSummary;