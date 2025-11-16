import {Dayjs} from "dayjs";
import {MoneyDto} from "../../value-history/DTOs/Money";

export type Transaction = {
    key: string;
    date: Dayjs;
    debit: LedgerEntry | undefined;
    credit: LedgerEntry | undefined;
}

export interface LedgerEntry {
    componentId: string;
    physicalAllocationId: string;
    value: MoneyDto
}