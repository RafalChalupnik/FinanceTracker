using FinanceTracker.Core.Primitives;

namespace FinanceTracker.Core;

internal interface IEntityWithValueHistory
{
    IEnumerable<DateOnly> GetEvaluationDates();
    
    MoneyValue? GetValueFor(DateOnly date);
}

public abstract class EntityWithValueHistory : IEntityWithValueHistory
{
    private readonly List<HistoricValue> _valueHistory = [];

    /// <summary>
    /// History of the value.
    /// </summary>
    public IReadOnlyList<HistoricValue> ValueHistory => _valueHistory
        .OrderBy(x => x.Date)
        .ToArray();
    
    /// <summary>
    /// Sets value for specific date.
    /// </summary>
    public HistoricValue? SetValue(DateOnly date, Money value, Guid? physicalAllocationId = null)
    {
        var alreadyExistingEntry = ValueHistory.FirstOrDefault(entry => entry.Date == date);

        if (alreadyExistingEntry != null)
        {
            alreadyExistingEntry.Value = value;
            return null;
        }

        var newValue = new HistoricValue
        {
            Id = Guid.NewGuid(),
            Date = date,
            Value = value,
            PhysicalAllocationId = physicalAllocationId
        };
            
        _valueHistory.Add(newValue);
        return newValue;
    }

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
        // .Value;

        if (historicValue == null)
        {
            return null;
        }

        return new MoneyValue(
            Value: historicValue.Value,
            ExactDate: historicValue.Date == date
        );
    }
}