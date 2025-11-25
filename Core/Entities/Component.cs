using System.ComponentModel.DataAnnotations;
using FinanceTracker.Core.Interfaces;
using FinanceTracker.Core.Primitives;

namespace FinanceTracker.Core.Entities;

public class Component : IEntityWithValueHistory, IOrderableEntity
{
    [Key]
    public Guid Id { get; init; } = Guid.NewGuid();
    
    public Guid? DefaultPhysicalAllocationId { get; set; }

    /// <summary>
    /// User-friendly name of the wallet component.
    /// </summary>
    public string Name { get; set; } = string.Empty;
    
    /// <summary>
    /// Sequence in which wallets should be displayed.
    /// </summary>
    public int DisplaySequence { get; set; }
    
    /// <summary>
    /// ID of the <see cref="Group"/> the <see cref="Component"/> is part of.
    /// </summary>
    public Guid GroupId { get; init; }
    
    /// <summary>
    /// <see cref="Group"/> the <see cref="Component"/> is part of.
    /// </summary>
    public Group? Group { get; init; }
    
    /// <summary>
    /// History of the value.
    /// </summary>
    public IReadOnlyList<LedgerEntry> ValueHistory { get; } = new List<LedgerEntry>();
    
    public IEnumerable<DateOnly> GetEvaluationDates()
        => ValueHistory.Select(entry => entry.Date);
    
    /// <summary>
    /// Gets value for provided <see cref="DateOnly"/>.
    /// </summary>
    public MoneyValue? GetValueFor(DateOnly date)
    {
        var entries = ValueHistory
            .Where(entry => entry.Date <= date)
            .ToArray();

        if (entries.Length == 0)
        {
            return null;
        }
        
        var value = entries
            .Select(entry => entry.Value)
            .Aggregate((value1, value2) => value1.Plus(value2, "PLN"));
        
        return new MoneyValue(
            Value: value,
            ExactDate: entries.Last().Date == date,
            PhysicalAllocationId: entries.Last().PhysicalAllocationId
        );
    }
}