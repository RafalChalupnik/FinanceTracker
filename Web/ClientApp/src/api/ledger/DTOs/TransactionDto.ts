import {Dayjs} from "dayjs";
import {MoneyDto} from "../../value-history/DTOs/Money";

export type TransactionDto = {
    key: string;
    date: Dayjs;
    debit: LedgerEntryDto | undefined;
    credit: LedgerEntryDto | undefined;
}

export interface LedgerEntryDto {
    componentId: string;
    physicalAllocationId: string;
    value: MoneyDto
}