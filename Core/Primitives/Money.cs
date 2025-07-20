namespace FinanceTracker.Core.Primitives;

/// <summary>
/// Represents money as a value object - tuple of amount and currency.
/// </summary>
public record Money(
    decimal Amount,
    string Currency
    );