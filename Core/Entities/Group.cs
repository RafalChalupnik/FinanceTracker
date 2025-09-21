using FinanceTracker.Core.Extensions;
using FinanceTracker.Core.Interfaces;
using FinanceTracker.Core.Primitives;

namespace FinanceTracker.Core.Entities;

public class Group : IEntityWithValueHistory, IOrderableEntity
{
    private readonly List<Component> _components = [];
    private readonly List<HistoricTarget> _targets = [];
    
    /// <inheritdoc />
    public Guid Id { get; init; } = Guid.NewGuid();
    
    /// <inheritdoc />
    public required string Name { get; set; }
    
    /// <inheritdoc />
    public int DisplaySequence { get; set; }
    
    /// <summary>
    /// <see cref="GroupType"/> to which the <see cref="Group"/> belongs.
    /// </summary>
    public GroupType? GroupType { get; set; }
    
    /// ID of the <see cref="GroupType"/> to which the <see cref="Group"/> belongs.
    public Guid GroupTypeId { get; set; }
    
    /// <summary>
    /// Components of the <see cref="Group"/>.
    /// </summary>
    public IReadOnlyList<Component> Components => _components;
    
    /// <summary>
    /// Historic targets of the group.
    /// </summary>
    public IReadOnlyList<HistoricTarget> Targets => _targets;
    
    public IEnumerable<DateOnly> GetEvaluationDates() =>
        Components.SelectMany(component => component.GetEvaluationDates());

    /// <summary>
    /// Gets value of the wallet for provided <see cref="DateOnly"/> in main currency.
    /// </summary>
    public MoneyValue? GetValueFor(DateOnly date)
    {
        var moneyValues = Components
            .Select(component => component.GetValueFor(date))
            .WhereNotNull()
            .ToArray();
            
        var money = moneyValues
            .Select(moneyValue => moneyValue.Value)
            .ToArray()
            .Sum(mainCurrency: "PLN");

        if (money == null)
        {
            return null;
        }

        return new MoneyValue(
            Value: money,
            ExactDate: moneyValues.All(value => value.ExactDate),
            PhysicalAllocationId: null
        );
    }
}