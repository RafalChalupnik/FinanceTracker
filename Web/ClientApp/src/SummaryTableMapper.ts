import {EntitiesForDateDto} from "./ApiClient";
import {SummaryTableRow} from "./components/SummaryTable";

export function mapData (data: EntitiesForDateDto[]) : SummaryTableRow[] {
    return data.map(row => {
        return {
            date: row.date,
            components: row.entities.map(entity => {
                if (entity === null) {
                    return undefined;
                }
                
                return {
                    value: entity.value,
                    change: entity.change,
                    cumulativeChange: entity.cumulativeChange
                }
            }),
            summary: {
                value: row.summary.value,
                change: row.summary.change,
                cumulativeChange: row.summary.cumulativeChange
            }
        }
    })
}