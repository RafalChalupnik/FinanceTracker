import SimpleComponentsPage from "./SimpleComponentsPage";
import {DateGranularity, deleteDebtsValues, getDebtsValueHistory, setDebtValue} from "../api/ValueHistoryApi";

const Debts = () => {
    return <SimpleComponentsPage
        title='Debts'
        defaultGranularity={DateGranularity.Day}
        getData={getDebtsValueHistory}
        editable={{
            setValue: setDebtValue,
            deleteValues: deleteDebtsValues
        }}
    />;
};

export default Debts;