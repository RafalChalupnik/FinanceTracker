using System.ComponentModel.DataAnnotations;
using FinanceTracker.Core.Primitives;

namespace FinanceTracker.Core;

public class HistoricValue
{
    [Key]
    public Guid Id { get; init; } = Guid.NewGuid();
    
    public DateOnly Date { get; init; }
    
    public required Money Value { get; set; }
    
    public Guid? AssetId { get; init; }
    
    public Guid? ComponentId { get; init; }
    
    public Component? Component { get; init; }
    
    public Guid? DebtId { get; init; }
    
    public Guid? PhysicalAllocationId { get; set; }
    
    public static HistoricValue CreateAssetValue(DateOnly date, Money value, Guid assetId)
        => new()
        {
            Date = date,
            Value = value,
            AssetId = assetId
        };
    
    public static HistoricValue CreateDebtValue(DateOnly date, Money value, Guid debtId)
        => new()
        {
            Date = date,
            Value = value,
            DebtId = debtId
        };
}