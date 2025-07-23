using System.ComponentModel.DataAnnotations;
using FinanceTracker.Core.Primitives;

namespace FinanceTracker.Core;

/// <summary>
/// Represents a wallet, consisting of <see cref="Component"/>.
/// </summary>
public class Wallet
{
    [Key]
    public Guid Id { get; init; }
    
    /// <summary>
    /// User-friendly name of the wallet.
    /// </summary>
    public required string Name { get; init; }
    
    /// <summary>
    /// Components of the wallet.
    /// </summary>
    public required List<Component> Components { get; init; }
    
    /// <summary>
    /// Target value of the wallet in the main currency - null if not specified.
    /// </summary>
    public decimal? Target { get; init; }

    /// <summary>
    /// Gets value of the wallet for provided <see cref="DateOnly"/> in main currency.
    /// </summary>
    public decimal GetValueFor(DateOnly date) => Components
        .Sum(component => component.GetValueFor(date).AmountInMainCurrency);
}

public class Component
{
    [Key]
    public Guid Id { get; init; }
    
    /// <summary>
    /// User-friendly name of the wallet component.
    /// </summary>
    public required string Name { get; init; }
    
    /// <summary>
    /// History of wallet component value in the main currency.
    /// </summary>
    public required List<HistoricValue> ValueHistory { get; init; }

    /// <summary>
    /// Gets value of the wallet component for provided <see cref="DateOnly"/>.
    /// </summary>
    public Money GetValueFor(DateOnly date) =>
        ValueHistory
            .OrderByDescending(x => x.Date)
            .First(x => x.Date <= date)
            .Value;
}