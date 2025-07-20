using FinanceTracker.Core.Extensions;
using FinanceTracker.Core.Primitives;

namespace FinanceTracker.Core;

/// <summary>
/// Represents a physical, non-monetary asset.
/// </summary>
/// <param name="Name">User-friendly name of the asset.</param>
/// <param name="ValueHistory">History of asset value in the main currency.</param>
/// <param name="FinancedBy">Debt that is financing the asset - null if not specified.</param>
public record Asset(
    string Name,
    Dictionary<DateOnly, Money> ValueHistory,
    Debt? FinancedBy = null
)
{
    /// <summary>
    /// Gets the latest net value of the asset (including the debt that is financing it).
    /// </summary>
    public decimal LatestNetValue =>
        ValueHistory
            .GetLatestValue()
            .AmountInMainCurrency - (FinancedBy?.LatestAmount ?? 0);
}