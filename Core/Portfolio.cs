using System.ComponentModel.DataAnnotations;
using FinanceTracker.Core.Exceptions;

namespace FinanceTracker.Core;

/// <summary>
/// Represents a total portfolio, consisting of wallets, assets, and debts.
/// </summary>
public class Portfolio(string name)
{
    private readonly List<Wallet> _wallets = [];
    private readonly List<Asset> _assets = [];
    private readonly List<Debt> _debts = [];
    
    [Key]
    public Guid Id { get; init; } = Guid.NewGuid();

    /// <summary>
    /// User-friendly name of the portfolio.
    /// </summary>
    public string Name => name;

    /// <summary>
    /// List of wallets.
    /// </summary>
    public IReadOnlyList<Wallet> Wallets => _wallets;
    
    /// <summary>
    /// List of assets.
    /// </summary>
    public IReadOnlyList<Asset> Assets => _assets;
    
    /// <summary>
    /// List of debts.
    /// </summary>
    public IReadOnlyList<Debt> Debts => _debts;

    /// <summary>
    /// Adds <see cref="Wallet"/> to the portfolio.
    /// </summary>
    /// <exception cref="DuplicateException"/>
    public void Add(Wallet wallet)
    {
        if (Wallets.Any(x => x.Name == wallet.Name))
        {
            throw new DuplicateException(entityType: nameof(Wallet), duplicatedValue: wallet.Name);
        }

        _wallets.Add(wallet);
    }

    /// <summary>
    /// Adds <see cref="Asset"/> to the portfolio.
    /// </summary>
    /// <exception cref="DuplicateException"/>
    public void Add(Asset asset)
    {
        if (Assets.Any(x => x.Name == asset.Name))
        {
            throw new DuplicateException(entityType: nameof(Asset), duplicatedValue: asset.Name);
        }

        _assets.Add(asset);
    }
    
    /// <summary>
    /// Adds <see cref="Debt"/> to the portfolio.
    /// </summary>
    /// <exception cref="DuplicateException"/>
    public void Add(Debt debt)
    {
        if (Debts.Any(x => x.Name == debt.Name))
        {
            throw new DuplicateException(entityType: nameof(Debt), duplicatedValue: debt.Name);
        }

        _debts.Add(debt);
    }
}