namespace FinanceTracker.Web.DTOs;

public record AssetsDto(
    IReadOnlyCollection<AssetDataDto> Data
);

public record AssetDataDto(
    DateOnly Date,
    IReadOnlyCollection<ValueSnapshotDto> Assets,
    ValueSnapshotDto Summary
);
