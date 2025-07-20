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
    public string Name { get; init; }
    
    /// <summary>
    /// History of asset value in the main currency.
    /// </summary>
    public List<HistoricValue> ValueHistory { get; init; }
    
    /// <summary>
    /// Debt that is financing the asset - null if not specified.
    /// </summary>
    public Debt? FinancedBy { get; init; }
    
    /// <summary>
    /// Gets the latest net value of the asset (including the debt that is financing it).
    /// </summary>
    public decimal LatestNetValue =>
        ValueHistory
            .GetLatestValue()
            .AmountInMainCurrency - (FinancedBy?.LatestAmount ?? 0);
}