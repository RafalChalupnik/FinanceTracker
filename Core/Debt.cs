using System.ComponentModel.DataAnnotations;
using FinanceTracker.Core.Extensions;
using FinanceTracker.Core.Primitives;

namespace FinanceTracker.Core;

/// <summary>
/// Represents a debt.
/// </summary>
public class Debt
{
    [Key]
    public Guid Id { get; init; }
    
    /// <summary>
    /// User-friendly name of the debt.
    /// </summary>
    public string Name { get; init; }
    
    /// <summary>
    /// History of debt value in the main currency.
    /// </summary>
    public List<HistoricValue> AmountHistory { get; init; }
    
    /// <summary>
    /// Gets the latest value of the debt.
    /// </summary>
    public decimal LatestAmount => AmountHistory
        .GetLatestValue()
        .AmountInMainCurrency;
}