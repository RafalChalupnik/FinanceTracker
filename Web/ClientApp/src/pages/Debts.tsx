import SimpleComponentsPage from "./SimpleComponentsPage";
import {DateGranularity} from "../api/value-history/DTOs/DateGranularity";
import {deleteDebtsValues, getDebtsValueHistory, setDebtValue} from "../api/value-history/Client";

const Debts = () => {
    return <SimpleComponentsPage
        title='Debts'
        defaultGranularity={DateGranularity.Day}
        getData={getDebtsValueHistory}
        editable={{
            createEmptyRow: (date, columns) => {
                return {
                    key: date.format("YYYY-MM-DD"),
                    entities: columns.map(_ => undefined),
                    summary: undefined
                }
            },
            setValue: setDebtValue,
            deleteValues: deleteDebtsValues
        }}
    />;
};

export default Debts;