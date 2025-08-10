namespace FinanceTracker.Core.Queries.DTOs;

public record ConfigurationDto(
    IReadOnlyCollection<OrderableEntityDto> Assets,
    IReadOnlyCollection<OrderableEntityDto> Debts,
    IReadOnlyCollection<WalletDataDto> Wallets
);

public record OrderableEntityDto(
    Guid Id,
    string Name,
    int DisplaySequence
);

public record WalletDataDto(
    Guid Id,
    string Name,
    int DisplaySequence,
    IReadOnlyCollection<OrderableEntityDto> Components
) : OrderableEntityDto(Id, Name, DisplaySequence);
