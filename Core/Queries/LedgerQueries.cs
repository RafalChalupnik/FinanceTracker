using FinanceTracker.Core.DTOs;
using FinanceTracker.Core.Entities;
using FinanceTracker.Core.Primitives;
using FinanceTracker.Core.Queries.DTOs;
using Microsoft.EntityFrameworkCore;

namespace FinanceTracker.Core.Queries;

public class LedgerQueries(FinanceTrackerContext dbContext)
{
    public NameValueDto[] GetComponentValues() =>
        dbContext.Components
            .Include(component => component.ValueHistory)
            .Select(component => new NameValueDto(
                component.Name,
                component.GetValueFor(DateOnly.FromDateTime(DateTime.Today))!.Value
                )
            )
            .ToArray();
    
    public NameValueDto[] GetPhysicalAllocationsValues() =>
        dbContext.PhysicalAllocations
            .Include(component => component.ValueHistory)
            .Select(component => new NameValueDto(
                    component.Name,
                    component.GetValueFor(DateOnly.FromDateTime(DateTime.Today))!.Value
                )
            )
            .ToArray();
    
    public TransactionDto[] GetTransactions() =>
        dbContext.Ledger
            .GroupBy(entry => new { entry.Date, entry.TransactionId })
            .Select(group => BuildTransactionDto(
                    group.Key.TransactionId,
                    group.Key.Date,
                    group.ToArray()
                )
            )
            .ToArray();

    private static TransactionDto BuildTransactionDto(
        Guid transactionId,
        DateOnly date,
        IReadOnlyCollection<LedgerEntry> entries
        )
    {
        var debit = entries.SingleOrDefault(entry => entry.Value.AmountInMainCurrency < 0);
        var credit = entries.SingleOrDefault(entry => entry.Value.AmountInMainCurrency > 0);
        
        return new TransactionDto(
            Key: transactionId,
            Date: date,
            Debit: BuildLedgerEntryDto(debit),
            Credit: BuildLedgerEntryDto(credit)
        );
    }

    private static LedgerEntryDto? BuildLedgerEntryDto(LedgerEntry? entry)
    {
        if (entry == null)
        {
            return null;
        }

        return new LedgerEntryDto(
            ComponentId: entry.ComponentId,
            Value: entry.Value,
            PhysicalAllocationId: entry.PhysicalAllocationId
        );
    }
}