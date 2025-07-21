namespace FinanceTracker.Web.DTOs;

public record PortfolioSummaryDto(
    IReadOnlyCollection<PortfolioDateSummaryDto> Data
);

public record PortfolioDateSummaryDto(
    DateOnly Date,
    ValueSnapshotDto Wallets,
    ValueSnapshotDto Assets,
    ValueSnapshotDto Debts,
    ValueSnapshotDto Summary
);
