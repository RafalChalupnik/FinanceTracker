import {DateGranularity} from "../api/value-history/DTOs/DateGranularity";
import {getPortfolioValueHistory} from "../api/value-history/Client";
import React from "react";
import {EditableMoneyComponent} from "../components/money/EditableMoneyComponent";
import {EntityColumnDto, ValueHistoryRecordDto} from "../api/value-history/DTOs/EntityTableDto";
import {ColumnGroup} from "../components/table/ExtendableTable";
import {buildComponentsColumns} from "../components/table/ColumnBuilder";

const PortfolioSummary = () => {
    let buildComponentColumns = (components: EntityColumnDto[], granularity: DateGranularity, updateCallback: () => Promise<void>): ColumnGroup<ValueHistoryRecordDto>[] => {
        return buildComponentsColumns(
            components,
            granularity,
            false
        )
    }
    
    return (
        <EditableMoneyComponent
            title='Portfolio Summary'
            getData={getPortfolioValueHistory}
            defaultGranularity={DateGranularity.Month}
            buildComponentColumns={buildComponentColumns}
        />
    );
};

export default PortfolioSummary;
