using System.ComponentModel.DataAnnotations;
using FinanceTracker.Core.Extensions;
using FinanceTracker.Core.Primitives;

namespace FinanceTracker.Core;

/// <summary>
/// Represents a physical, non-monetary asset.
/// </summary>
public class Asset
{
    [Key]
    public Guid Id { get; init; }
    
    /// <summary>
    /// User-friendly name of the asset.
    /// </summary>
    public required string Name { get; init; }
    
    /// <summary>
    /// History of asset value in the main currency.
    /// </summary>
    public required List<HistoricValue> ValueHistory { get; init; }
    
    /// <summary>
    /// Debt that is financing the asset - null if not specified.
    /// </summary>
    public Debt? FinancedBy { get; init; }
    
    /// <summary>
    /// Gets value of the wallet component for provided <see cref="DateOnly"/>.
    /// </summary>
    public decimal GetValueFor(DateOnly date) =>
        ValueHistory
            .OrderByDescending(x => x.Date)
            .First(x => x.Date <= date)
            .Value.AmountInMainCurrency - (FinancedBy?.GetAmountFor(date).AmountInMainCurrency ?? 0);
}