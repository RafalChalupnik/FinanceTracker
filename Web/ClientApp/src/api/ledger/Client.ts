import {MoneyDto} from "../value-history/DTOs/Money";

export async function updateTransactionDebitAmount(transactionId: string, amount: MoneyDto) : Promise<void> {
    alert(`Updated transaction ${transactionId} debit amount to ${amount.amount} ${amount.currency}`)
}

export async function updateTransactionCreditAmount(transactionId: string, amount: MoneyDto) : Promise<void> {
    alert(`Updated transaction ${transactionId} credit amount to ${amount.amount} ${amount.currency}`)
}

export async function deleteTransaction(transactionId: string) : Promise<void> {
    alert(`Deleted transaction: ${transactionId}`)
}