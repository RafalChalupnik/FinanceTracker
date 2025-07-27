namespace FinanceTracker.Core.Queries.DTOs;

public record PortfolioPerDateQueryDto(
    IReadOnlyCollection<PortfolioForDateDto> Data
);

public record PortfolioForDateDto(
    DateOnly Date,
    ValueSnapshotDto Wallets,
    ValueSnapshotDto Assets,
    ValueSnapshotDto Debts,
    ValueSnapshotDto Summary
);
