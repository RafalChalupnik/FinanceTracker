using FinanceTracker.Core.Entities;
using FinanceTracker.Core.Interfaces;

namespace FinanceTracker.Core.Queries.DTOs;

public record ConfigurationDto(
    IReadOnlyCollection<OrderableEntityDto> Assets,
    IReadOnlyCollection<OrderableEntityDto> Debts,
    IReadOnlyCollection<WalletDataDto> Wallets,
    IReadOnlyCollection<OrderableEntityDto> PhysicalAllocations
);

public record GroupTypeDto(
    Guid Key,
    string Name,
    int DisplaySequence,
    string Icon
) : OrderableEntityDto(
    Key,
    Name,
    DisplaySequence
)
{
    public GroupType ToGroupType() =>
        new()
        {
            Id = Key,
            Name = Name,
            IconName = Icon,
            DisplaySequence = DisplaySequence
        };
}

public record GroupTypeWithGroupsDto(
    Guid Key,
    string Name,
    int DisplaySequence,
    string Icon,
    IReadOnlyCollection<GroupDto> Groups
) : GroupTypeDto(
    Key, 
    Name, 
    DisplaySequence, 
    Icon
);

public record GroupDto(
    Guid Key,
    string Name,
    int DisplaySequence,
    Guid GroupTypeId
);

public record OrderableEntityDto(
    Guid Key,
    string Name,
    int DisplaySequence
)
{
    public static OrderableEntityDto FromEntity(IOrderableEntity entity) =>
        new(
            Key: entity.Id, 
            Name: entity.Name, 
            DisplaySequence: entity.DisplaySequence
        );
}

public record WalletDataDto(
    Guid Key,
    string Name,
    int DisplaySequence,
    IReadOnlyCollection<WalletComponentDataDto> Components
) : OrderableEntityDto(Key, Name, DisplaySequence);

public record WalletComponentDataDto(
    Guid Key,
    string Name,
    int DisplaySequence,
    Guid? DefaultPhysicalAllocationId
) : OrderableEntityDto(Key, Name, DisplaySequence);