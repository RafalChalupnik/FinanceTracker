namespace FinanceTracker.Core.Queries.DTOs;

public record WalletsPerDateQueryDto(
    IReadOnlyCollection<WalletDto> Wallets
);
    
public record WalletDto(
    Guid Id,
    string Name,
    IReadOnlyCollection<EntityHeaderDto> Headers,
    IReadOnlyCollection<WalletForDateDto> Data
);

public record WalletForDateDto(
    string Key,
    IReadOnlyCollection<ValueSnapshotDto?> Entities,
    ValueSnapshotDto Summary,
    WalletTargetDto? Target
);

public record WalletTargetDto(
    decimal TargetInMainCurrency,
    decimal Percentage
);