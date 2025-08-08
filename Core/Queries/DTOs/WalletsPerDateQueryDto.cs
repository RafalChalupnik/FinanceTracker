namespace FinanceTracker.Core.Queries.DTOs;

public record WalletsPerDateQueryDto(
    IReadOnlyCollection<EntityHeaderDto> Headers,
    IReadOnlyCollection<WalletsForDateDto> Data
);

public record WalletsForDateDto(
    string Key,
    IReadOnlyCollection<ValueSnapshotDto?> Entities,
    ValueSnapshotDto Summary,
    YieldDto Yield
);

public record YieldDto(
    decimal ChangePercent,
    decimal Inflation,
    decimal TotalChangePercent
);