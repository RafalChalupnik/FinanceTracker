import SimpleComponentsPage from "./SimpleComponentsPage";
import {DateGranularity, getWalletsValueHistory} from "../api/ValueHistoryApi";
import {buildInflationColumn} from "../components/ColumnBuilder";

const WalletsSummary = () => {
    const update = async (date: string, value: any) => {
        alert(`Updated inflation on ${date} to ${value}`)
    }
    
    let extraColumns = [
        buildInflationColumn(update)
    ]
    
    return <SimpleComponentsPage
        title='Wallets Summary'
        defaultGranularity={DateGranularity.Month}
        getData={getWalletsValueHistory}
        extraColumns={extraColumns}
    />;
};

export default WalletsSummary;