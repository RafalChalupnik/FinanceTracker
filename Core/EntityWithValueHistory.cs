using FinanceTracker.Core.Primitives;

namespace FinanceTracker.Core;

internal interface IEntityWithValueHistory
{
    IEnumerable<DateOnly> GetEvaluationDates();
    
    MoneyValue? GetValueFor(DateOnly date);
}

public abstract class EntityWithValueHistory : IEntityWithValueHistory
{
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