namespace FinanceTracker.Core;

/// <summary>
/// Represents a logical wallet - a wallet that does not exist in the real world,
/// but is rather a "fund" that can be allocated in different physical wallets.
/// </summary>
/// <param name="Name">User-friendly name of the wallet.</param>
/// <param name="Target">Target value of the wallet. Null if unspecified.</param>
public record LogicalWallet(
    string Name,
    decimal? Target = null
)
{
    /// <summary>
    /// Gets allocations in the physical wallets.
    /// </summary>
    public IReadOnlyDictionary<PhysicalWallet, decimal> GetAllocations(Ledger ledger) =>
        ledger.Transactions.Aggregate(
            seed: new Dictionary<PhysicalWallet, decimal>(),
            func: (allocations, transaction) =>
            {
                if (transaction.From?.Logical == this)
                {
                    allocations.TryAdd(transaction.From.Physical, 0);
                    allocations[transaction.From.Physical] -= transaction.From.Amount;
                }
                else if (transaction.To?.Logical == this)
                {
                    allocations.TryAdd(transaction.To.Physical, 0);
                    allocations[transaction.To.Physical] += transaction.To.Amount;
                }

                return allocations;
            }
        )
        .AsReadOnly();

    public decimal CalculateValue(Ledger ledger, IReadOnlyDictionary<string, decimal> conversions)
    {
        return GetAllocations(ledger)
            .Select(allocation => conversions[allocation.Key.Currency] * allocation.Value)
            .Sum();
    }
}