using System.ComponentModel.DataAnnotations;

namespace FinanceTracker.Core.Primitives;

public class HistoricValue
{
    [Key]
    public Guid Id { get; init; }
    
    public DateOnly Date { get; init; }
    
    public required Money Value { get; set; }
}