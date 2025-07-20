using System.ComponentModel.DataAnnotations;

namespace FinanceTracker.Core;

/// <summary>
/// Represents a total portfolio, consisting of wallets, assets, and debts.
/// </summary>
public class Portfolio
{
    [Key]
    public Guid Id { get; init; }
    
    /// <summary>
    /// User-friendly name of the portfolio.
    /// </summary>
    public required string Name { get; init; }
    
    /// <summary>
    /// List of wallets.
    /// </summary>
    public required List<Wallet> Wallets { get; init; }
    
    /// <summary>
    /// List of assets.
    /// </summary>
    public required List<Asset> Assets { get; init; }
    
    /// <summary>
    /// List of debts.
    /// </summary>
    public required List<Debt> Debts { get; init; }
    
    /// <summary>
    /// Gets the latest value of the portfolio.
    /// </summary>
    public decimal LatestValue => Wallets
        .Sum(x => x.LatestValue) + Assets
        .Sum(x => x.LatestNetValue) - Debts
        .Sum(x => x.LatestAmount);
}