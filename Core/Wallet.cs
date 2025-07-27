using System.ComponentModel.DataAnnotations;
using FinanceTracker.Core.Exceptions;
using FinanceTracker.Core.Interfaces;

namespace FinanceTracker.Core;

/// <summary>
/// Represents a wallet, consisting of <see cref="Component"/>.
/// </summary>
public class Wallet(string name, int displaySequence) : IOrderableEntity, IEntityWithValueHistory
{
    private readonly List<Component> _components = [];
    
    [Key]
    public Guid Id { get; init; } = Guid.NewGuid();

    /// <summary>
    /// User-friendly name of the wallet.
    /// </summary>
    public string Name => name;
    
    /// <summary>
    /// Sequence in which wallets should be displayed.
    /// </summary>
    public int DisplaySequence => displaySequence;

    /// <summary>
    /// Components of the wallet.
    /// </summary>
    public IReadOnlyList<Component> Components => _components;

    public IEnumerable<DateOnly> GetEvaluationDates() => Components
        .SelectMany(component => component.GetEvaluationDates());

    /// <summary>
    /// Gets value of the wallet for provided <see cref="DateOnly"/> in main currency.
    /// </summary>
    public decimal? GetValueFor(DateOnly date) => Components
        .Sum(component => component.GetValueFor(date) ?? 0);

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
}

public class Component(string name, int displaySequence) 
    : EntityWithValueHistory, IOrderableEntity
{
    [Key]
    public Guid Id { get; init; } = Guid.NewGuid();

    /// <summary>
    /// User-friendly name of the wallet component.
    /// </summary>
    public string Name => name;
    
    /// <summary>
    /// Sequence in which wallets should be displayed.
    /// </summary>
    public int DisplaySequence => displaySequence;
}