import {MoneyDto} from "../../value-history/DTOs/Money";

export type TransactionDto = {
    key: string;
    date: string;
    debit: LedgerEntryDto | undefined;
    credit: LedgerEntryDto | undefined;
}

export interface LedgerEntryDto {
    componentId: string;
    physicalAllocationId: string;
    value: MoneyDto
}