using FinanceTracker.Core.Interfaces;

namespace FinanceTracker.Core;

public class InflationHistoricValue : IEntity
{
    public Guid Id { get; init; }
    
    public DateOnly Date { get; init; }
    
    public decimal Value { get; init; }
}