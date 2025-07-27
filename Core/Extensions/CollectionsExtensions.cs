namespace FinanceTracker.Core.Extensions;

internal static class CollectionsExtensions
{
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
}