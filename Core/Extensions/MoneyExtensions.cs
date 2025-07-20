using FinanceTracker.Core.Primitives;

namespace FinanceTracker.Core.Extensions;

public static class MoneyExtensions
{
    public static decimal ApplyConversion(this Money money, IReadOnlyDictionary<string, decimal> conversion)
        => conversion[money.Currency] * money.Amount;
}