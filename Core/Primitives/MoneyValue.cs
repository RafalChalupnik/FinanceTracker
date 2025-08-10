namespace FinanceTracker.Core.Primitives;

public record MoneyValue(
    Money Value,
    bool ExactDate
);