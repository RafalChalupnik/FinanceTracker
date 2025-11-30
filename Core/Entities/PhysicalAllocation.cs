using System.ComponentModel.DataAnnotations;
using FinanceTracker.Core.Interfaces;
using FinanceTracker.Core.Primitives;

namespace FinanceTracker.Core.Entities;

public class PhysicalAllocation : IOrderableEntity
{
    [Key]
    public Guid Id { get; init; } = Guid.NewGuid();

    /// <summary>
    /// User-friendly name of the asset.
    /// </summary>
    public string Name { get; set; } = string.Empty;

    /// <summary>
    /// Sequence in which assets should be displayed.
    /// </summary>
    public int DisplaySequence { get; set; }

    /// <summary>
    /// History of the value allocations.
    /// </summary>
    public IReadOnlyList<LedgerEntry> ValueHistory { get; init; } = new List<LedgerEntry>();
    
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