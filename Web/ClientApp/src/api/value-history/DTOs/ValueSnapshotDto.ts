import { MoneyDto } from "./Money";

export type EntityValueSnapshotDto = ValueSnapshotDto & {
    inferred: boolean
}

export type ValueSnapshotDto = {
    value: MoneyDto;
    change: MoneyDto;
    cumulativeChange: MoneyDto;
}