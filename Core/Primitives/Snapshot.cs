namespace FinanceTracker.Core.Primitives;

public record Snapshot<T>(
    DateOnly Date,
    T Value
    );