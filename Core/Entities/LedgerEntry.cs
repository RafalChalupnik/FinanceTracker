using FinanceTracker.Core.Primitives;

namespace FinanceTracker.Core.Entities;

public class LedgerEntry
{
    public Guid Id { get; init; } = Guid.NewGuid();
    
    public DateOnly Date { get; init; }
    
    public Guid TransactionId { get; init; }
    
    public Guid ComponentId { get; set; }
    
    public Guid? PhysicalAllocationId { get; set; }
    
    public required Money Value { get; set; }
}