namespace FinanceTracker.Core.Views.DTOs;

public record PortfolioPerDateViewDto(
    IReadOnlyCollection<PortfolioForDateDto> Data
);

public record PortfolioForDateDto(
    DateOnly Date,
    ValueSnapshotDto Wallets,
    ValueSnapshotDto Assets,
    ValueSnapshotDto Debts,
    ValueSnapshotDto Summary
);
