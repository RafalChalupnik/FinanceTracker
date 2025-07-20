using FinanceTracker.Core.Extensions;
using FinanceTracker.Core.Primitives;

namespace FinanceTracker.Core;

/// <summary>
/// Represents a debt.
/// </summary>
/// <param name="Name">User-friendly name of the debt.</param>
/// <param name="AmountHistory">History of debt amount in the main currency.</param>
public record Debt(
    string Name,
    Dictionary<DateOnly, Money> AmountHistory
)
{
    /// <summary>
    /// Gets the latest value of the debt.
    /// </summary>
    public decimal LatestAmount => AmountHistory
        .GetLatestValue()
        .AmountInMainCurrency;
}