namespace FinanceTracker.Core;

/// <summary>
/// Represents a total portfolio, consisting of wallets, assets, and debts.
/// </summary>
public record Portfolio(
    List<LogicalWallet> Wallets,
    List<Asset> Assets,
    List<Debt> Debts
)
{
    public decimal CalculateValue(IReadOnlyDictionary<string, decimal> conversions)
    {
        return Wallets
            .Select(wallet => wallet.CalculateValue(conversions))
            .Sum() 
            + Assets.Sum(asset => asset.Value)
            - Debts.Sum(debt => debt.Amount);
    }
}