using FinanceTracker.Core.Exceptions;
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
    /// Determines whether to include <see cref="HistoricTarget"/> values for this <see cref="Group"/>.
    /// </summary>
    public bool ShowTargets { get; set; }
    
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
    
    /// <summary>
    /// Adds <see cref="Component"/> to the wallet.
    /// </summary>
    /// <exception cref="DuplicateException"/>
    public void Add(Component component)
    {
        if (Components.Any(x => x.Name == component.Name))
        {
            throw new DuplicateException(entityType: nameof(Component), duplicatedValue: component.Name);
        }

        _components.Add(component);
    }
    
    /// <summary>
    /// Adds <see cref="HistoricTarget"/> to the wallet.
    /// </summary>
    public HistoricTarget? SetTarget(DateOnly date, decimal valueInMainCurrency)
    {
        var alreadyExistingTarget = Targets.FirstOrDefault(x => x.Date == date);
        
        if (alreadyExistingTarget != null)
        {
            alreadyExistingTarget.ValueInMainCurrency = valueInMainCurrency;
            return null;
        }

        var newTarget = new HistoricTarget
        {
            Id = Guid.NewGuid(),
            Date = date,
            ValueInMainCurrency = valueInMainCurrency
        };
        
        _targets.Add(newTarget);
        return newTarget;
    }
}