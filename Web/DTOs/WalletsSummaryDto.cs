namespace FinanceTracker.Web.DTOs;

public record WalletsSummaryDto(
    IReadOnlyCollection<WalletsDateSummaryDto> Data
);

public record WalletsDateSummaryDto(
    DateOnly Date,
    IReadOnlyCollection<ValueSnapshotDto> Wallets,
    ValueSnapshotDto Summary
);

