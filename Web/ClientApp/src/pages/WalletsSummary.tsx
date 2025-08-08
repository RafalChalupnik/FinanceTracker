import SimpleComponentsPage from "./SimpleComponentsPage";
import {DateGranularity, getWalletsValueHistory, setInflation} from "../api/ValueHistoryApi";
import {buildInflationColumn} from "../components/ColumnBuilder";
import dayjs from "dayjs";

const WalletsSummary = () => {
    const updateInflation = async (date: string, value: number) => {
        let updatedDate = dayjs(date).endOf('month')
        await setInflation(updatedDate.format("YYYY-MM-DD"), value);
    }
    
    let extraColumns = [
        buildInflationColumn(updateInflation)
    ]
    
    return <SimpleComponentsPage
        title='Wallets Summary'
        defaultGranularity={DateGranularity.Month}
        getData={getWalletsValueHistory}
        extraColumns={extraColumns}
    />;
};

export default WalletsSummary;