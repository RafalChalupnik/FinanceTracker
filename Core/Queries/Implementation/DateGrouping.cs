using System.Globalization;
using FinanceTracker.Core.Queries.DTOs;

namespace FinanceTracker.Core.Queries.Implementation;

internal static class DateGrouping
{
    public static (DateOnly Date, string Representation)[] GroupDates(this IEnumerable<DateOnly> dates, DateGranularity granularity)
    {
        Func<DateOnly, string> keySelector = granularity switch
        {
            DateGranularity.Date => GetDateFormat,
            DateGranularity.Week => GetWeekFormat,
            DateGranularity.Month => GetMonthFormat,
            DateGranularity.Quarter => GetQuarterFormat,
            DateGranularity.Year => GetYearFormat,
            _ => throw new ArgumentOutOfRangeException(nameof(granularity), granularity, null)
        };
        
        return dates
            .GroupBy(keySelector)
            .Select(group => (Date: group.Max(), Representation: group.Key))
            .OrderBy(x => x.Date)
            .ToArray();
    }

    private static string GetDateFormat(DateOnly date) => date.ToString("yyyy-MM-dd");
    
    private static string GetWeekFormat(DateOnly date)
    {
        var weekOfYear = CultureInfo.CurrentCulture.Calendar.GetWeekOfYear(
            date.ToDateTime(TimeOnly.MinValue),
            CalendarWeekRule.FirstDay,
            firstDayOfWeek: DayOfWeek.Monday
        );

        return $"{date.Year}-W{weekOfYear:D2}";
    }
    
    private static string GetMonthFormat(DateOnly date) => date.ToString("yyyy-MM");
    
    private static string GetQuarterFormat(DateOnly date)
    {
        var quarter = (date.Month - 1) / 3 + 1;
        return $"{date.Year}-Q{quarter}";
    }
    
    private static string GetYearFormat(DateOnly date) => date.ToString("yyyy");
}