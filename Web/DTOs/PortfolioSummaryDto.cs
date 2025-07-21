using FinanceTracker.Core.Primitives;

namespace FinanceTracker.Web.DTOs;

public record PortfolioSummaryDto(
    IReadOnlyCollection<WalletDto> Wallets,
    IReadOnlyCollection<ValueSnapshotDto> Summary
);

public record WalletDto(
    string Name,
    IReadOnlyCollection<ValueSnapshotDto> Snapshots
);
    
public record ValueSnapshotDto(
    DateOnly Date,
    decimal Value,
    decimal Change,
    decimal CumulativeChange,
    decimal ShareOfWallet
);
