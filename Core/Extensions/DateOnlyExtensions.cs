namespace FinanceTracker.Core.Extensions;

internal static class DateOnlyExtensions
{
    public static (DateOnly Start, DateOnly End) SingleDateAsRange(this DateOnly date) => (date, date);

    public static (DateOnly Start, DateOnly End) GetWeekRange(this DateOnly date, DayOfWeek weekStart)
    {
        var diff = (7 + (date.DayOfWeek - weekStart)) % 7;
        var start = date.AddDays(-diff);
        var end = start.AddDays(6);
        return (start, end);
    }
    
    public static (DateOnly Start, DateOnly End) GetMonthRange(this DateOnly date)
    {
        var start = new DateOnly(date.Year, date.Month, day: 1);
        var end = start.AddMonths(1).AddDays(-1);
        return (start, end);
    }
    
    public static (DateOnly Start, DateOnly End) GetQuarterRange(this DateOnly date)
    {
        var quarter = (date.Month - 1) / 3; // 0-based quarter index
        var start = new DateOnly(date.Year, month: quarter * 3 + 1, day: 1);
        var end = start.AddMonths(3).AddDays(-1);
        return (start, end);
    }
    
    public static (DateOnly Start, DateOnly End) GetYearRange(this DateOnly date)
    {
        var start = new DateOnly(date.Year, month: 1, day: 1);
        var end = new DateOnly(date.Year, month: 12, day: 31);
        return (start, end);
    }
}