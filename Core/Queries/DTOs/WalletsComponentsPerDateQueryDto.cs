namespace FinanceTracker.Core.Queries.DTOs;

public record WalletsComponentsPerDateQueryDto(
    IReadOnlyCollection<WalletComponentsDto> Wallets
);
    
public record WalletComponentsDto(
    Guid Id,
    string Name,
    IReadOnlyCollection<EntityHeaderDto> Headers,
    IReadOnlyCollection<WalletComponentsForDateDto> Data
);

public record WalletComponentsForDateDto(
    string Key,
    IReadOnlyCollection<ValueSnapshotDto?> Entities,
    ValueSnapshotDto Summary,
    WalletTargetDto? Target
);

public record WalletTargetDto(
    decimal TargetInMainCurrency,
    decimal Percentage
);