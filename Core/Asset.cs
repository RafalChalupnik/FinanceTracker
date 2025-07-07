namespace FinanceTracker.Core;

/// <summary>
/// Represents a physical, non-monetary asset.
/// </summary>
/// <param name="Name">User-friendly name of the asset.</param>
/// <param name="Value">Current value of the asset. Must be a non-negative value.</param>
public record Asset(
    string Name,
    Money Value
);
