import { MoneyDto } from "./Money";

export type EntityValueSnapshotDto = ValueSnapshotDto & {
    inferred: boolean,
    physicalAllocationId: string | undefined
}

export type ValueSnapshotDto = {
    value: MoneyDto;
    change: MoneyDto;
    cumulativeChange: MoneyDto;
}