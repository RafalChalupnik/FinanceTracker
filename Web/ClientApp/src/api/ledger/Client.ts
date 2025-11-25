import {TransactionDto} from "./DTOs/TransactionDto";
import {sendDelete, sendGet, sendPost} from "../shared/HttpClient";

export async function getTransactions() : Promise<TransactionDto[]> {
    return sendGet("api/ledger")
}

export async function upsertTransaction(transaction: TransactionDto) : Promise<void> {
    await sendPost("api/ledger", transaction);
}

export async function deleteTransaction(transactionId: string) : Promise<void> {
    await sendDelete(`api/ledger/${transactionId}`);
}