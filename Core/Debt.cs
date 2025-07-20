using FinanceTracker.Core.Primitives;

namespace FinanceTracker.Core;

/// <summary>
/// Represents a debt.
/// </summary>
/// <param name="Name">User-friendly name of the debt.</param>
/// <param name="AmountHistory">History of debt amount.</param>
public record Debt(
    string Name,
    List<Snapshot<decimal>> AmountHistory
);