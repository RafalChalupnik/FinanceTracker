using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using FinanceTracker.Core.Exceptions;
using FinanceTracker.Core.Extensions;
using FinanceTracker.Core.Interfaces;
using FinanceTracker.Core.Primitives;

namespace FinanceTracker.Core;

/// <summary>
/// Represents a wallet, consisting of <see cref="Component"/>.
/// </summary>
public class Wallet : IEntityWithValueHistory, IOrderableEntity
{
    private readonly List<Component> _components = [];
    private readonly List<WalletTarget> _targets = [];
    
    [Key]
    public Guid Id { get; init; } = Guid.NewGuid();

    /// <summary>
    /// User-friendly name of the wallet.
    /// </summary>
    public string Name { get; set; } = string.Empty;
    
    /// <summary>
    /// Sequence in which wallets should be displayed.
    /// </summary>
    public int DisplaySequence { get; set; }

    /// <summary>
    /// Components of the wallet.
    /// </summary>
    public IReadOnlyList<Component> Components => _components;

    /// <summary>
    /// Historic targets of the wallet.
    /// </summary>
    public IReadOnlyList<WalletTarget> Targets => _targets;

    public IEnumerable<DateOnly> GetEvaluationDates() => Components
        .SelectMany(component => component.GetEvaluationDates());

    /// <summary>
    /// Gets value of the wallet for provided <see cref="DateOnly"/> in main currency.
    /// </summary>
    public Money? GetValueFor(DateOnly date) =>
        Components
            .Select(component => component.GetValueFor(date))
            .WhereNotNull()
            .ToArray()
            .Sum(mainCurrency: "PLN");

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
    /// Adds <see cref="WalletTarget"/> to the wallet.
    /// </summary>
    /// <exception cref="DuplicateException"/>
    public void Add(WalletTarget target)
    {
        if (Targets.Any(x => x.Date == target.Date))
        {
            throw new DuplicateException(entityType: nameof(WalletTarget), duplicatedValue: target.Date);
        }

        _targets.Add(target);
    }
}

/// <summary>
/// Historic target value of the wallet.
/// </summary>
[ComplexType]
public class WalletTarget
{
    public Guid Id { get; init; } = Guid.NewGuid();
    
    /// <summary>
    /// Date the target value has been set.
    /// </summary>
    public DateOnly Date { get; init; }
    
    /// <summary>
    /// Target value of the wallet in main currency.
    /// </summary>
    public decimal ValueInMainCurrency { get; init; }
}

public class Component : EntityWithValueHistory, IOrderableEntity
{
    [Key]
    public Guid Id { get; init; } = Guid.NewGuid();

    /// <summary>
    /// User-friendly name of the wallet component.
    /// </summary>
    public string Name { get; set; } = string.Empty;
    
    /// <summary>
    /// Sequence in which wallets should be displayed.
    /// </summary>
    public int DisplaySequence { get; set; }
    
    /// <summary>
    /// ID of the wallet the component is part of.
    /// </summary>
    public Guid WalletId { get; init; }
}