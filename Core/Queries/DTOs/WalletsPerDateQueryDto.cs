namespace FinanceTracker.Core.Queries.DTOs;

public record WalletsPerDateQueryDto(
    IReadOnlyCollection<WalletDto> Wallets
);
    
public record WalletDto(
    Guid Id,
    string Name,
    IReadOnlyCollection<EntitiesForDateDto> Data
);
