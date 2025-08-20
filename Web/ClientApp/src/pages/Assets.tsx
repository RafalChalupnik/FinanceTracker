import {DateGranularity} from "../api/value-history/DTOs/DateGranularity";
import {
    deleteAssetsValues,
    getAssetsValueHistory,
    setAssetValue
} from "../api/value-history/Client";
import React from "react";
import {EditableMoneyComponent} from "../components/money/EditableMoneyComponent";

const Assets = () => (
    <EditableMoneyComponent
        title='Assets'
        getData={getAssetsValueHistory}
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
            onUpdate: setAssetValue,
            onDelete: deleteAssetsValues
        }}
    />
);

export default Assets;