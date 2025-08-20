import {buildComponentsColumns, buildInflationColumn} from "../components/table/ColumnBuilder";
import {EditableMoneyComponent} from "../components/money/EditableMoneyComponent";
import React from "react";
import {getWalletsValueHistory, setInflation} from "../api/value-history/Client";
import {DateGranularity} from "../api/value-history/DTOs/DateGranularity";
import ScoreChart from "../components/charts/custom/ScoreChart";
import {EntityColumnDto, ValueHistoryRecordDto} from "../api/value-history/DTOs/EntityTableDto";
import {ColumnGroup} from "../components/table/ExtendableTable";

const WalletsSummary = () => {
    let buildComponentColumns = (components: EntityColumnDto[], granularity: DateGranularity, updateCallback: () => Promise<void>): ColumnGroup<ValueHistoryRecordDto>[] => {
        return buildComponentsColumns(
            components,
            granularity,
            true
        )
    }
    
    let buildExtraColumns = (granularity: DateGranularity, refreshCallback: () => Promise<void>) => [
        buildInflationColumn(granularity, async (year: number, month: number, value: number, confirmed: boolean) => {
            await setInflation(year, month, value, confirmed);
            await refreshCallback();
        })
    ]
    
    return (
        <EditableMoneyComponent
            title={'Wallets Summary'}
            getData={getWalletsValueHistory}
            buildComponentColumns={buildComponentColumns}
            buildExtraColumns={buildExtraColumns}
            extra={data => (<ScoreChart data={data.rows}/>)}
            allowedGranularities={[
                DateGranularity.Month,
                DateGranularity.Quarter,
                DateGranularity.Year
            ]}
            defaultGranularity={DateGranularity.Month}
        />
    );
};

export default WalletsSummary;