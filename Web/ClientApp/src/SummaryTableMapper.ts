import {EntitiesForDateDto} from "./ApiClient";
import {SummaryTableRow} from "./components/SummaryTable";
import dayjs from "dayjs";

export function mapData (data: EntitiesForDateDto[]) : SummaryTableRow[] {
    return data.map(row => {
        return {
            key: dayjs(row.date).format('YYYY-MM-DD'),
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