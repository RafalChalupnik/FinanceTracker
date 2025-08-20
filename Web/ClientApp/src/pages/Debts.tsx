import {DateGranularity} from "../api/value-history/DTOs/DateGranularity";
import {
    deleteDebtsValues,
    getDebtsValueHistory, setDebtValue
} from "../api/value-history/Client";
import React from "react";
import {EditableMoneyComponent} from "../components/money/EditableMoneyComponent";

const Debts = () => (
    <EditableMoneyComponent
        title='Debts'
        getData={getDebtsValueHistory}
        showInferredValues={true}
        defaultGranularity={DateGranularity.Day}
        editable={{
            createEmptyRow: (date, columns) => {
                return {
                    key: date.format("YYYY-MM-DD"),
                    entities: columns.map(_ => undefined),
                    summary: undefined
                }
            },
            onUpdate: setDebtValue,
            onDelete: deleteDebtsValues
        }}
    />
);

export default Debts;