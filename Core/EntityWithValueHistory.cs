using FinanceTracker.Core.Primitives;

namespace FinanceTracker.Core;

public abstract class EntityWithValueHistory
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
    public void Evaluate(DateOnly date, Money value)
    {
        var alreadyExistingEntry = ValueHistory.FirstOrDefault(entry => entry.Date == date);

        if (alreadyExistingEntry != null)
        {
            alreadyExistingEntry.Value = value;
        }
        else
        {
            _valueHistory.Add(new HistoricValue
            {
                Id = Guid.NewGuid(),
                Date = date,
                Value = value
            });
        }
    }
    
    /// <summary>
    /// Gets value for provided <see cref="DateOnly"/>.
    /// </summary>
    public Money? GetValueFor(DateOnly date) =>
        ValueHistory
            .OrderByDescending(x => x.Date)
            .FirstOrDefault(x => x.Date <= date)?
            .Value;
}