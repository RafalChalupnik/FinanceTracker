import {EntitiesForDateDto} from "./ApiClient";
import {SummaryTableHeader, SummaryTableRow} from "./components/SummaryTable";

function zip<T, U>(a: T[], b: U[]): [T, U][] {
    if (a.length !== b.length) {
        throw new Error("Arrays must be of equal length");
    }
    
    const length = Math.min(a.length, b.length);
    const result: [T, U][] = [];

    for (let i = 0; i < length; i++) {
        result.push([a[i], b[i]]);
    }

    return result;
}

export function mapData (headers: SummaryTableHeader[], data: EntitiesForDateDto[]) : SummaryTableRow[] {
    console.log(headers)
    console.log(data)
    
    return data.map(row => {
        return {
            date: row.date,
            components: zip(headers, row.entities).map(tuple => {
                const header = tuple[0]
                const entity = tuple[1]
                
                if (entity === null) {
                    return undefined;
                }
                
                return {
                    value: entity.value,
                    change: entity.change,
                    cumulativeChange: entity.cumulativeChange,
                    id: header.id
                }
            }),
            summary: {
                value: row.summary.value,
                change: row.summary.change,
                cumulativeChange: row.summary.cumulativeChange,
                id: ""
            }
        }
    })
}