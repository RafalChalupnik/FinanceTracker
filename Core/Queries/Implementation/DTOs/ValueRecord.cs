using FinanceTracker.Core.Entities;
using FinanceTracker.Core.Queries.DTOs;

namespace FinanceTracker.Core.Queries.Implementation.DTOs;

internal record ValueRecord(
    DateRange DateRange,
    IReadOnlyList<EntityValueSnapshotDto?> Entities,
    ValueSnapshotDto Summary
)
{
    public ValueHistoryRecordDto ToValueHistoryRecord(
        HistoricTarget? target = null,
        InflationDto? inflation = null
        ) =>
        new(
            Key: DateRange.Representation,
            Entities: Entities,
            Summary: Summary,
            Target: BuildTargetData(target),
            Score: BuildScoreDto(inflation)
        );
    
    private TargetDto? BuildTargetData(HistoricTarget? target)
    {
        if (target == null || target.ValueInMainCurrency == 0)
        {
            return null;
        }
        
        var percentage = Summary.Value.AmountInMainCurrency / target.ValueInMainCurrency;
        
        return new TargetDto(
            TargetInMainCurrency: target.ValueInMainCurrency,
            Percentage: decimal.Round(percentage * 100, decimals: 2)
        );
    }
    
    private ScoreDto? BuildScoreDto(InflationDto? inflation)
    {
        if (inflation == null)
        {
            return null;
        }
        
        var previousValue = Summary.Value.AmountInMainCurrency - Summary.Change.AmountInMainCurrency;
        var currentValue = Summary.Value.AmountInMainCurrency;

        var changePercent = decimal.Round(currentValue * 100 / previousValue, decimals: 2) - 100;
        
        return new ScoreDto(
            ChangePercent: changePercent,
            Inflation: inflation,
            TotalChangePercent: changePercent - (inflation?.Value ?? 0)
        );
    }
}
