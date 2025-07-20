using FinanceTracker.Core.Extensions;
using FinanceTracker.Core.Primitives;

namespace FinanceTracker.Core;

/// <summary>
/// Represents a wallet, consisting of <see cref="Component"/>.
/// </summary>
/// <param name="Name">User-friendly name of the wallet.</param>
/// <param name="Components">Components of the wallet.</param>
/// <param name="Target">Target value of the wallet in main currency - null if not specified.</param>
public record Wallet(
    string Name,
    List<Component> Components,
    decimal? Target = null
)
{
    /// <summary>
    /// Gets the latest value of the wallet.
    /// </summary>
    public decimal LatestValue => Components
        .Sum(x => x.LatestAmount);
}

public record Component(
    string Name,
    Dictionary<DateOnly, Money> ValueHistory
)
{
    /// <summary>
    /// Gets the latest value of the wallet component.
    /// </summary>
    public decimal LatestAmount => ValueHistory
        .GetLatestValue()
        .AmountInMainCurrency;
}