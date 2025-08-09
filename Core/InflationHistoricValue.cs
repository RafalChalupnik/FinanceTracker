using FinanceTracker.Core.Interfaces;

namespace FinanceTracker.Core;

public class InflationHistoricValue : IEntity
{
    public Guid Id { get; init; }
    
    public int Year { get; init; }
    
    public int Month { get; init; }
    
    public decimal Value { get; set; }

    public bool FitsInRange(DateOnly from, DateOnly to)
    {
        var date = new DateOnly(Year, Month, 1).AddMonths(1).AddDays(-1);
        return date >= from && date <= to;
    }
}