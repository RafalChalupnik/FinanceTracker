namespace FinanceTracker.Core.Queries.DTOs;

public record WalletsComponentsDto(
    IReadOnlyCollection<WalletComponentsTableDto> Wallets
);

public record WalletComponentsTableDto(
    Guid Id,
    string Name,
    IReadOnlyCollection<EntityColumnDto> Columns,
    IReadOnlyCollection<WalletComponentsValueHistoryRecordDto> Rows
) : EntityTableDto<WalletComponentsValueHistoryRecordDto>(Columns, Rows);

public record EntityTableDto<T>(
    IReadOnlyCollection<EntityColumnDto> Columns,
    IReadOnlyCollection<T> Rows
) where T : ValueHistoryRecordDto;

public record EntityColumnDto(
    string Name,
    Guid? Id
);

public record ValueHistoryRecordDto(
    string Key,
    IReadOnlyCollection<ValueSnapshotDto?> Entities,
    ValueSnapshotDto Summary
);

public record WalletValueHistoryRecordDto(
    string Key,
    IReadOnlyCollection<ValueSnapshotDto?> Entities,
    ValueSnapshotDto Summary,
    YieldDto Yield
) : ValueHistoryRecordDto(Key, Entities, Summary);

public record YieldDto(
    decimal ChangePercent,
    decimal? Inflation,
    decimal TotalChangePercent
);

public record WalletComponentsValueHistoryRecordDto(
    string Key,
    IReadOnlyCollection<ValueSnapshotDto?> Entities,
    ValueSnapshotDto Summary,
    WalletTargetDto? Target
) : ValueHistoryRecordDto(Key, Entities, Summary);

public record WalletTargetDto(
    decimal TargetInMainCurrency,
    decimal Percentage
);