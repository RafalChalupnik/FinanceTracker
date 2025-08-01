import {EntitiesForDateDto} from "./ApiClient";
import {SummaryTableRow} from "./pages/SummaryTable";
import dayjs from "dayjs";

export function mapData (data: EntitiesForDateDto[]) : SummaryTableRow[] {
    return data.map(row => {
        let date = dayjs(row.date).format('YYYY-MM-DD')
        
        return {
            key: date,
            date: date,
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