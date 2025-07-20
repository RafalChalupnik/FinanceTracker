using FinanceTracker.Core.Extensions;

namespace FinanceTracker.Core;

/// <summary>
/// Represents a total portfolio, consisting of wallets, assets, and debts.
/// </summary>
public record Portfolio(
    List<Wallet> Wallets,
    List<Asset> Assets,
    List<Debt> Debts
);