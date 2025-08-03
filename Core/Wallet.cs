using System.ComponentModel.DataAnnotations;
using FinanceTracker.Core.Exceptions;
using FinanceTracker.Core.Extensions;
using FinanceTracker.Core.Interfaces;
using FinanceTracker.Core.Primitives;

namespace FinanceTracker.Core;

/// <summary>
/// Represents a wallet, consisting of <see cref="Component"/>.
/// </summary>
public class Wallet(string name, int displaySequence) : IEntityWithValueHistory, IOrderableEntity
{
    private readonly List<Component> _components = [];
    
    [Key]
    public Guid Id { get; init; } = Guid.NewGuid();

    /// <summary>
    /// User-friendly name of the wallet.
    /// </summary>
    public string Name { get; set; } = name;
    
    /// <summary>
    /// Sequence in which wallets should be displayed.
    /// </summary>
    public int DisplaySequence { get; set; } = displaySequence;

    /// <summary>
    /// Components of the wallet.
    /// </summary>
    public IReadOnlyList<Component> Components => _components;

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