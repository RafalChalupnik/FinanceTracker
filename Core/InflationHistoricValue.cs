namespace FinanceTracker.Core;

public class InflationHistoricValue
{
    public Guid Id { get; init; }
    
    public DateOnly Date { get; init; }
    
    public decimal Value { get; init; }
}