import {DateGranularity} from "../api/value-history/DTOs/DateGranularity";
import {
    deleteDebtsValues,
    getDebtsValueHistory, setDebtValue
} from "../api/value-history/Client";
import React from "react";
import {EditableMoneyComponent} from "../components/money/EditableMoneyComponent";
import {EntityColumnDto, ValueHistoryRecordDto} from "../api/value-history/DTOs/EntityTableDto";
import {ColumnGroup} from "../components/table/ExtendableTable";
import {buildComponentsColumns} from "../components/table/ColumnBuilder";

const Debts = () => {
    let buildComponentColumns = (components: EntityColumnDto[], granularity: DateGranularity, updateCallback: () => Promise<void>): ColumnGroup<ValueHistoryRecordDto>[] => {
        return buildComponentsColumns(
            components,
            granularity,
            true,
            async (entityId, date, value) => {
                await setDebtValue(entityId, date, value);
                await updateCallback();
            }
        )
    }
    
    return (
        <EditableMoneyComponent
            title='Debts'
            getData={getDebtsValueHistory}
            showCompositionChart={true}
            defaultGranularity={DateGranularity.Day}
            editable={{
                createEmptyRow: (date, columns) => {
                    return {
                        key: date.format("YYYY-MM-DD"),
                        entities: columns.map(_ => undefined),
                        summary: undefined
                    }
                },
                onDelete: deleteDebtsValues
            }}
            buildComponentColumns={buildComponentColumns}
        />
    );
};

export default Debts;