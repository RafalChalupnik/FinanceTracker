namespace FinanceTracker.Core;

/// <summary>
/// Represents a logical wallet - a wallet that does not exist in the real world,
/// but is rather a "fund" that can be allocated in different physical wallets.
/// </summary>
/// <param name="Name">User-friendly name of the wallet.</param>
/// <param name="Allocations">Allocations in the physical wallets.</param>
/// <param name="Target">Target value of the wallet. Null if unspecified.</param>
public record LogicalWallet(
    string Name,
    Dictionary<PhysicalWallet, decimal> Allocations,
    decimal? Target = null
)
{
    public decimal CalculateValue(IReadOnlyDictionary<string, decimal> conversions)
    {
        return Allocations
            .Select(allocation => conversions[allocation.Key.Currency] * allocation.Value)
            .Sum();
    }
}