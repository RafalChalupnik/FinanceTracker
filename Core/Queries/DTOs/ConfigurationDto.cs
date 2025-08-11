namespace FinanceTracker.Core.Queries.DTOs;

public record ConfigurationDto(
    IReadOnlyCollection<OrderableEntityDto> Assets,
    IReadOnlyCollection<OrderableEntityDto> Debts,
    IReadOnlyCollection<WalletDataDto> Wallets,
    IReadOnlyCollection<OrderableEntityDto> PhysicalAllocations
);

public record OrderableEntityDto(
    Guid Key,
    string Name,
    int DisplaySequence
);

public record WalletDataDto(
    Guid Key,
    string Name,
    int DisplaySequence,
    IReadOnlyCollection<OrderableEntityDto> Components
) : OrderableEntityDto(Key, Name, DisplaySequence);
