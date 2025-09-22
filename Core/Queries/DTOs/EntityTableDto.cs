namespace FinanceTracker.Core.Queries.DTOs;

public record EntityTableDto(
    IReadOnlyCollection<EntityColumnDto> Columns,
    IReadOnlyCollection<ValueHistoryRecordDto> Rows
);

public record EntityColumnDto(
    Guid Id,
    string Name,
    string? ParentName,
    Guid? DefaultPhysicalAllocationId
);

public record ValueHistoryRecordDto(
    string Key,
    IReadOnlyCollection<EntityValueSnapshotDto?> Entities,
    ValueSnapshotDto Summary,
    // Extras
    TargetDto? Target = null,
    ScoreDto? Score = null
);

public record TargetDto(
    decimal TargetInMainCurrency,
    decimal Percentage
);

public record ScoreDto(
    decimal ChangePercent,
    InflationDto? Inflation,
    decimal TotalChangePercent
);

public record InflationDto(
    decimal Value,
    bool Confirmed
);
