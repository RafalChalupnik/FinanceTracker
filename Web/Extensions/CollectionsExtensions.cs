namespace FinanceTracker.Web.Extensions;

internal static class CollectionsExtensions
{
    public static IReadOnlyList<T> Scan<T>(this IReadOnlyList<T> source, Func<T, T, T> scanFunction)
    {
        if (source.Count < 2)
        {
            return source;
        }

        var output = new List<T>(capacity: source.Count)
        {
            source[0]
        };

        foreach (var current in source.Skip(1))
        {
            output.Add(scanFunction(output.Last(), current));
        }

        return output;
    }

    public static IEnumerable<T> WhereNotNull<T>(this IEnumerable<T?> source) where T : class =>
        source.Where(x => x != null).Select(x => x!);
}