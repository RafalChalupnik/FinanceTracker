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
}