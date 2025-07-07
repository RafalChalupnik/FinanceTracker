namespace FinanceTracker.Core;

/// <summary>
/// Represents a debt.
/// </summary>
/// <param name="Name">User-friendly name of the debt.</param>
/// <param name="Amount">Current amount of the debt. Must be a non-positive value.</param>
public record Debt(
    string Name,
    Money Amount
    );