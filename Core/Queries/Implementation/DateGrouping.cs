using System.Globalization;
using FinanceTracker.Core.Extensions;
using FinanceTracker.Core.Queries.DTOs;
using FinanceTracker.Core.Queries.Implementation.DTOs;

namespace FinanceTracker.Core.Queries.Implementation;

internal static class DateGrouping
{
    private const DayOfWeek WeekStart = DayOfWeek.Monday;
    
    public static DateRange[] GroupDates(this IEnumerable<DateOnly> dates, DateGranularity granularity)
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
            .Select(group => BuildDateRange(
                    granularity: granularity,
                    representation: group.Key,
                    sampleDate: group.First()
                )
            )
            .OrderBy(x => x.From)
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

    private static DateRange BuildDateRange(
        DateGranularity granularity, 
        string representation, 
        DateOnly sampleDate)
    {
        var range = granularity switch
        {
            DateGranularity.Date => sampleDate.SingleDateAsRange(),
            DateGranularity.Week => sampleDate.GetWeekRange(weekStart: WeekStart),
            DateGranularity.Month => sampleDate.GetMonthRange(),
            DateGranularity.Quarter => sampleDate.GetQuarterRange(),
            DateGranularity.Year => sampleDate.GetYearRange(),
            _ => throw new ArgumentOutOfRangeException(nameof(granularity), granularity, null)
        };
        
        return new DateRange(
            Granularity: granularity,
            From: range.Start,
            To: range.End,
            Representation: representation
        );
    }
}