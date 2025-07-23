using System.ComponentModel.DataAnnotations;
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
    public required string Name { get; init; }
    
    /// <summary>
    /// History of debt value in the main currency.
    /// </summary>
    public required List<HistoricValue> AmountHistory { get; init; }
    
    /// <summary>
    /// Gets value of the wallet component for provided <see cref="DateOnly"/>.
    /// </summary>
    public Money GetAmountFor(DateOnly date) =>
        AmountHistory
            .OrderByDescending(x => x.Date)
            .First(x => x.Date <= date)
            .Value;
}