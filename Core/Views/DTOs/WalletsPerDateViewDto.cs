namespace FinanceTracker.Core.Views.DTOs;

public record WalletsPerDateViewDto(
    IReadOnlyCollection<WalletDto> Wallets
);
    
public record WalletDto(
    Guid Id,
    string Name,
    IReadOnlyCollection<EntitiesForDateDto> Data
);
