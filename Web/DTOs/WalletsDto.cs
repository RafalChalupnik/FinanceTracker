namespace FinanceTracker.Web.DTOs;

public record WalletsDto(
    IReadOnlyCollection<WalletDto> Wallets
);
    
public record WalletDto(
    Guid Id,
    string Name,
    IReadOnlyCollection<WalletDataDto> Data
);

public record WalletDataDto(
    DateOnly Date,
    IReadOnlyCollection<ValueSnapshotDto> Components,
    ValueSnapshotDto Summary
);