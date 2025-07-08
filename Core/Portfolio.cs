using FinanceTracker.Core.Extensions;

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
    public decimal CalculateValue(Ledger ledger, IReadOnlyDictionary<string, decimal> conversions)
    {
        return Wallets.Sum(wallet => wallet.CalculateValue(ledger, conversions))
            + Assets.Sum(asset => asset.CurrentValue.ApplyConversion(conversions))
            - Debts.Sum(debt => debt.CurrentAmount.ApplyConversion(conversions));
    }
}