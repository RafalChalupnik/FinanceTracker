using System.ComponentModel.DataAnnotations.Schema;

namespace FinanceTracker.Core.Entities;

/// <summary>
/// Historic target value.
/// </summary>
[ComplexType]
public class HistoricTarget
{
    /// <summary>
    /// ID of the target.
    /// </summary>
    public Guid Id { get; init; } = Guid.NewGuid();
    
    /// <summary>
    /// ID of the <see cref="Group"/> the <see cref="HistoricTarget"/> is referring of.
    /// </summary>
    public Guid GroupId { get; init; }
    
    /// <summary>
    /// Date the target value has been set.
    /// </summary>
    public DateOnly Date { get; init; }
    
    /// <summary>
    /// Target value of the wallet in main currency.
    /// </summary>
    public decimal ValueInMainCurrency { get; set; }
}
