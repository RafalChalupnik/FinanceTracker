namespace FinanceTracker.Core;

/// <summary>
/// Represents a debt.
/// </summary>
/// <param name="Name">User-friendly name of the debt.</param>
/// <param name="AmountHistory">History of debt amount.</param>
public record Debt(
    string Name,
    List<(DateOnly Date, Money Value)> AmountHistory
)
{
    /// <summary>
    /// Current amount of the debt.
    /// </summary>
    public Money CurrentAmount => AmountHistory
        .OrderBy(x => x.Date)
        .Last().Value;
}