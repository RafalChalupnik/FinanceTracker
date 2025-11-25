import {TransactionDto} from "./DTOs/TransactionDto";
import {sendGet} from "../shared/HttpClient";

export async function getTransactions() : Promise<TransactionDto[]> {
    return sendGet("api/ledger")
}

export async function upsertTransaction(transaction: TransactionDto) : Promise<void> {
    alert(`Upserted transaction ${transaction.key}`);
}

export async function deleteTransaction(transactionId: string) : Promise<void> {
    alert(`Deleted transaction: ${transactionId}`)
}