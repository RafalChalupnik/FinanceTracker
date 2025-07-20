using FinanceTracker.Core.Primitives;

namespace FinanceTracker.Core.Extensions;

public static class MoneyExtensions
{
    public static T GetLatestValue<T>(this IReadOnlyDictionary<DateOnly, T> history) => history
        .MaxBy(x => x.Key)
        .Value;
}