using FinanceTracker.Core.Extensions;
using FinanceTracker.Core.Primitives;

namespace FinanceTracker.Core;

/// <summary>
/// Represents a physical, non-monetary asset.
/// </summary>
/// <param name="Name">User-friendly name of the asset.</param>
/// <param name="ValueHistory">History of asset value in main currency.</param>
/// <param name="FinancedBy">Debt that is financing the asset - null if not specified.</param>
public record Asset(
    string Name,
    Dictionary<DateOnly, Money> ValueHistory,
    Debt? FinancedBy = null
)
{
    public decimal LatestNetValue =>
        ValueHistory
            .GetLatestValue()
            .AmountInMainCurrency - (FinancedBy?.LatestAmount ?? 0);
}