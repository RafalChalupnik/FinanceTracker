import SimpleComponentsPage from "./SimpleComponentsPage";
import {deleteDebtsValues, getDebtsValueHistory, setDebtValue} from "../api/ValueHistoryApi";

const Debts = () => {
    return <SimpleComponentsPage
        title='Debts'
        getData={getDebtsValueHistory}
        editable={{
            setValue: setDebtValue,
            deleteValues: deleteDebtsValues
        }}
    />;
};

export default Debts;