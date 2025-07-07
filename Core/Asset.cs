namespace FinanceTracker.Core;

/// <summary>
/// Represents a physical, non-monetary asset.
/// </summary>
/// <param name="Name">User-friendly name of the asset.</param>
/// <param name="ValueHistory">History of asset value.</param>
public record Asset(
    string Name,
    List<(DateOnly Date, Money Value)> ValueHistory
)
{
    /// <summary>
    /// Current value of the asset.
    /// </summary>
    public Money CurrentValue => ValueHistory
        .OrderBy(x => x.Date)
        .Last().Value;
}
