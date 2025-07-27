using System.ComponentModel.DataAnnotations;
using FinanceTracker.Core.Interfaces;

namespace FinanceTracker.Core;

/// <summary>
/// Represents a debt.
/// </summary>
public class Debt(string name, int displaySequence) : EntityWithValueHistory, IOrderableEntity
{
    [Key]
    public Guid Id { get; init; } = Guid.NewGuid();

    /// <summary>
    /// User-friendly name of the debt.
    /// </summary>
    public string Name => name;
    
    /// <summary>
    /// Sequence in which debts should be displayed.
    /// </summary>
    public int DisplaySequence => displaySequence;
}