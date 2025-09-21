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
    public IReadOnlyList<HistoricValue> ValueHistory { get; } = new List<HistoricValue>();
    
    public IEnumerable<DateOnly> GetEvaluationDates()
        => ValueHistory.Select(entry => entry.Date);
    
    /// <summary>
    /// Gets value for provided <see cref="DateOnly"/>.
    /// </summary>
    public MoneyValue? GetValueFor(DateOnly date)
    {
        var historicValue = ValueHistory
            .OrderByDescending(x => x.Date)
            .FirstOrDefault(x => x.Date <= date);

        if (historicValue == null)
        {
            return null;
        }

        return new MoneyValue(
            Value: historicValue.Value,
            ExactDate: historicValue.Date == date,
            PhysicalAllocationId: historicValue.PhysicalAllocationId
        );
    }
}