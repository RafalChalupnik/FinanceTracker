namespace FinanceTracker.Web.Extensions;

internal static class CollectionsExtensions
{
    public static IReadOnlyList<T> Scan<T>(this IReadOnlyList<T> source, Func<T, T, T> scanFunction)
    {
        if (source.Count < 2)
        {
            return source;
        }

        var output = new List<T>(capacity: source.Count);

        for (var i = 1; i <= source.Count; i++)
        {
            output.Add(scanFunction(source[i - 1], source[i]));
        }

        return output;
    }

    public static IEnumerable<T> WhereNotNull<T>(this IEnumerable<T?> source) where T : class =>
        source.Where(x => x != null).Select(x => x!);
}