namespace FinanceTracker.Core.Queries.DTOs;

public record PortfolioPerDateQueryDto(
    IReadOnlyCollection<PortfolioForDateDto> Data
);

public record PortfolioForDateDto(
    DateOnly Date,
    EntityValueDto Wallets,
    EntityValueDto Assets,
    EntityValueDto Debts,
    EntityValueDto Summary
);
