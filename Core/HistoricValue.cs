using System.ComponentModel.DataAnnotations;
using FinanceTracker.Core.Primitives;

namespace FinanceTracker.Core;

public class HistoricValue
{
    [Key]
    public Guid Id { get; init; }
    
    public Component? Component { get; init; }
    
    public Guid? PhysicalAllocationId { get; init; }
    
    public DateOnly Date { get; init; }
    
    public required Money Value { get; set; }
}