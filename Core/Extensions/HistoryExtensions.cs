using FinanceTracker.Core.Primitives;

namespace FinanceTracker.Core.Extensions;

public static class HistoryExtensions
{
    public static T GetLatestValue<T>(this IReadOnlyDictionary<DateOnly, T> history) => history
        .MaxBy(x => x.Key)
        .Value;
    
    public static Money GetLatestValue(this IEnumerable<HistoricValue> history) => history
        .MaxBy(x => x.Date)!
        .Value;
}