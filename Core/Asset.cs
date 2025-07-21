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
    /// Gets value of the wallet component for provided <see cref="DateOnly"/>.
    /// </summary>
    public Money GetValueFor(DateOnly date) =>
        ValueHistory
            .OrderByDescending(x => x.Date)
            .First(x => x.Date <= date)
            .Value;
}