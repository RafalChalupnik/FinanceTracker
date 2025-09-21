using System.ComponentModel.DataAnnotations;
using FinanceTracker.Core.Primitives;

namespace FinanceTracker.Core.Entities;

public class HistoricValue
{
    [Key]
    public Guid Id { get; init; } = Guid.NewGuid();
    
    public DateOnly Date { get; init; }
    
    public required Money Value { get; set; }
    
    public Guid? ComponentId { get; init; }
    
    public Component? Component { get; init; }
    
    public Guid? PhysicalAllocationId { get; set; }
    
    public static HistoricValue CreateComponentValue(DateOnly date, Money value, Guid componentId, Guid? physicalAllocationId)
        => new()
        {
            Date = date,
            Value = value,
            ComponentId = componentId,
            PhysicalAllocationId = physicalAllocationId
        };
}