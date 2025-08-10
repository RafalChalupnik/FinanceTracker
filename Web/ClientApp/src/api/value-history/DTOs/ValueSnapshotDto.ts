import { MoneyDto } from "./Money";

export type ValueSnapshotDto = {
    value: MoneyDto;
    change: MoneyDto;
    cumulativeChange: MoneyDto;
}