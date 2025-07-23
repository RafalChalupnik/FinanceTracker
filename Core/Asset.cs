using System.ComponentModel.DataAnnotations;
using FinanceTracker.Core.Primitives;

namespace FinanceTracker.Core;

/// <summary>
/// Represents a physical, non-monetary asset.
/// </summary>
public class Asset(Guid id, string name)
{
    private readonly List<HistoricValue> _valueHistory = [];
    
    [Key]
    public Guid Id => id;

    /// <summary>
    /// User-friendly name of the asset.
    /// </summary>
    public string Name => name;

    /// <summary>
    /// History of asset value in the main currency.
    /// </summary>
    public IReadOnlyList<HistoricValue> ValueHistory 
        => _valueHistory.OrderBy(x => x.Date).ToArray();

    /// <summary>
    /// Sets value of asset for specific date.
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
    /// Gets value of the wallet component for provided <see cref="DateOnly"/>.
    /// </summary>
    public Money GetValueFor(DateOnly date) =>
        ValueHistory
            .OrderByDescending(x => x.Date)
            .First(x => x.Date <= date)
            .Value;
}