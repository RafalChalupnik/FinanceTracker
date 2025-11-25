using FinanceTracker.Core.DTOs;
using FinanceTracker.Core.Entities;
using Microsoft.EntityFrameworkCore;

namespace FinanceTracker.Core.Commands;

public class LedgerCommands(FinanceTrackerContext dbContext)
{
    public void UpsertTransaction(TransactionDto transaction)
    {
        var entries = dbContext.Ledger
            .Where(entry => entry.TransactionId == transaction.Key)
            .ToArray();
        
        UpdateEntry(
            existingEntity: entries.SingleOrDefault(
                entry => entry.Value.AmountInMainCurrency < 0
            ), 
            transaction, 
            transaction.Debit
        );
        
        UpdateEntry(
            existingEntity: entries.SingleOrDefault(
                entry => entry.Value.AmountInMainCurrency > 0
            ), 
            transaction, 
            transaction.Credit
        );

        dbContext.SaveChanges();
    }

    public void DeleteTransaction(Guid transactionId)
    {
        dbContext.Ledger
            .Where(entry => entry.TransactionId == transactionId)
            .ExecuteDelete();
    }

    private void UpdateEntry(
        LedgerEntry? existingEntity, 
        TransactionDto transaction, 
        LedgerEntryDto? entry
        )
    {
        if (entry == null)
        {
            if (existingEntity != null)
            {
                dbContext.Remove(existingEntity);
            }
            else
            {
                // Nothing to do
                return;
            }
        }
        else if (existingEntity != null)
        {
            existingEntity.ComponentId = entry.ComponentId;
            existingEntity.Value = entry.Value;
            existingEntity.PhysicalAllocationId = entry.PhysicalAllocationId;
        }
        else
        {
            var newEntity = new LedgerEntry
            {
                Date = transaction.Date,
                TransactionId = transaction.Key,
                ComponentId = entry.ComponentId,
                Value = entry.Value,
                PhysicalAllocationId = entry.PhysicalAllocationId
            };

            dbContext.Add(newEntity);
        }
    }
}