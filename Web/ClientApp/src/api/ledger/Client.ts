import {MoneyDto} from "../value-history/DTOs/Money";
import {Transaction} from "./DTOs/Transaction";
import dayjs from "dayjs";

export function getTransactions() : Transaction[] {
    return [
        {
            key: 't1',
            date: dayjs('2022-01-01'),
            debit: undefined,
            credit: {
                componentId: '297bee2b-6f78-439d-9752-029f56d1dfbb',
                physicalAllocationId: 'p1',
                value: {
                    amount: 100,
                    currency: 'PLN',
                    amountInMainCurrency: 100
                }
            }
        },
        {
            key: 't2',
            date: dayjs('2023-01-01'),
            debit: {
                componentId: 'c2',
                physicalAllocationId: 'p2',
                value: {
                    amount: -100,
                    currency: 'CAD',
                    amountInMainCurrency: -200
                }
            },
            credit: undefined
        },
        {
            key: 't3',
            date: dayjs('2024-01-01'),
            debit: {
                componentId: 'c3',
                physicalAllocationId: 'p3',
                value: {
                    amount: -50,
                    currency: 'PLN',
                    amountInMainCurrency: -50
                }
            },
            credit: {
                componentId: 'c4',
                physicalAllocationId: 'p4',
                value: {
                    amount: 50,
                    currency: 'PLN',
                    amountInMainCurrency: 50
                }
            }
        }
    ] 
}

export async function upsertTransaction(transaction: Transaction) : Promise<void> {
    alert(`Upserted transaction ${transaction.key}`);
}

export async function deleteTransaction(transactionId: string) : Promise<void> {
    alert(`Deleted transaction: ${transactionId}`)
}