using FinanceTracker.Core.Primitives;

namespace FinanceTracker.Core.Extensions;

internal static class CollectionsExtensions
{
    public static bool IsEmpty<T>(this IEnumerable<T> source) => !source.Any();
    
    public static IEnumerable<T> Scan<T>(this IEnumerable<T> source, Func<T, T, T> scanFunction)
    {
        using var enumerator = source.GetEnumerator();

        if (enumerator.MoveNext() == false)
        {
            yield break;
        }

        var previous = enumerator.Current;

        while (enumerator.MoveNext())
        {
            var projection = scanFunction(previous, enumerator.Current);
            yield return projection;
            previous = projection;
        }
    }
    
    public static Money? Sum(this IReadOnlyCollection<Money> source, string mainCurrency)
    {
        if (source.IsEmpty())
        {
            return null;
        }
        
        return source.Aggregate((first, second) 
            => first.Plus(second, mainCurrency));
    }
    
    public static IEnumerable<T> WhereNotNull<T>(this IEnumerable<T?> source) where T : class =>
        source.Where(x => x != null).Select(x => x!);
}