using FinanceTracker.Core.Primitives;

namespace FinanceTracker.Core;

/// <summary>
/// Represents a physical, non-monetary asset.
/// </summary>
/// <param name="Name">User-friendly name of the asset.</param>
/// <param name="ValueHistory">History of asset value.</param>
/// <param name="FinancedBy">Debt that is financing the asset - null if not specified.</param>
public record Asset(
    string Name,
    List<Snapshot<decimal>> ValueHistory,
    Debt? FinancedBy = null
);