namespace FinanceTracker.Core.Queries.DTOs;

public record EntityTableDto<T>(
    IReadOnlyCollection<EntityColumnDto> Columns,
    IReadOnlyCollection<T> Rows
) where T : ValueHistoryRecordDto;

public record EntityColumnDto(
    string Name,
    Guid? Id,
    Guid? DefaultPhysicalAllocationId
);

public record ValueHistoryRecordDto(
    string Key,
    IReadOnlyCollection<EntityValueSnapshotDto?> Entities,
    ValueSnapshotDto Summary
);

public record WalletValueHistoryRecordDto(
    string Key,
    IReadOnlyCollection<EntityValueSnapshotDto?> Entities,
    ValueSnapshotDto Summary,
    YieldDto Yield
) : ValueHistoryRecordDto(Key, Entities, Summary);

public record YieldDto(
    decimal ChangePercent,
    InflationDto? Inflation,
    decimal TotalChangePercent
);

public record InflationDto(
    decimal Value,
    bool Confirmed
);

public record WalletComponentsValueHistoryRecordDto(
    string Key,
    IReadOnlyCollection<EntityValueSnapshotDto?> Entities,
    ValueSnapshotDto Summary,
    WalletTargetDto? Target
) : ValueHistoryRecordDto(Key, Entities, Summary);

public record WalletTargetDto(
    decimal TargetInMainCurrency,
    decimal Percentage
);