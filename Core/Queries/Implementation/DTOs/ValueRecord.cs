using FinanceTracker.Core.Queries.DTOs;

namespace FinanceTracker.Core.Queries.Implementation.DTOs;

internal record ValueRecord(
    DateRange DateRange,
    IReadOnlyList<ValueSnapshotDto?> Entities,
    ValueSnapshotDto Summary
)
{
    public ValueHistoryRecordDto ToValueHistoryRecord() =>
        new ValueHistoryRecordDto(
            Key: DateRange.Representation,
            Entities: Entities,
            Summary: Summary
        );

    public WalletValueHistoryRecordDto ToWalletValueHistoryRecord(YieldDto yield) =>
        new WalletValueHistoryRecordDto(
            Key: DateRange.Representation,
            Entities: Entities,
            Summary: Summary,
            Yield: yield
        );
    
    public WalletComponentsValueHistoryRecordDto ToWalletComponentsValueHistoryRecord(
        WalletTargetDto? target)
    {
        return new WalletComponentsValueHistoryRecordDto(
            Key: DateRange.Representation,
            Entities: Entities,
            Summary: Summary,
            Target: target
        );
    }
}
