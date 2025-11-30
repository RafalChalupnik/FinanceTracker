import {TransactionDto} from "./DTOs/TransactionDto";
import {sendDelete, sendGet, sendPost} from "../shared/HttpClient";
import {NameValueDto} from "./DTOs/NameValueDto";

export async function getComponentValues() : Promise<NameValueDto[]> {
    return sendGet("api/ledger/components");
}

export async function getPhysicalAllocationsValues() : Promise<NameValueDto[]> {
    return sendGet("api/ledger/physical-allocations");
}

export async function getTransactions() : Promise<TransactionDto[]> {
    return sendGet("api/ledger")
}

export async function upsertTransaction(transaction: TransactionDto) : Promise<void> {
    await sendPost("api/ledger", transaction);
}

export async function deleteTransaction(transactionId: string) : Promise<void> {
    await sendDelete(`api/ledger/${transactionId}`);
}