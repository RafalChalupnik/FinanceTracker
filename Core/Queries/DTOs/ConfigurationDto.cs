using FinanceTracker.Core.Interfaces;

namespace FinanceTracker.Core.Queries.DTOs;

public record ConfigurationDto(
    IReadOnlyCollection<OrderableEntityDto> Assets,
    IReadOnlyCollection<OrderableEntityDto> Debts,
    IReadOnlyCollection<WalletDataDto> Wallets
);

public record WalletDataDto(
    Guid Id,
    string Name,
    int DisplaySequence,
    IReadOnlyCollection<OrderableEntityDto> Components
);

public record OrderableEntityDto(
    Guid Id,
    string Name,
    int DisplaySequence
);
