using FinanceTracker.Core.Entities;

namespace FinanceTracker.Core.Queries.DTOs;

public record ConfigurationDto(
    IReadOnlyCollection<GroupTypeConfigDto> GroupTypes,
    IReadOnlyCollection<OrderableEntityDto> PhysicalAllocations
);

public record GroupTypeConfigDto(
    Guid Key,
    string Name,
    int DisplaySequence,
    string Icon,
    IReadOnlyCollection<GroupConfigDto> Groups
) : OrderableEntityDto(
    Key: Key,
    Name: Name, 
    DisplaySequence: DisplaySequence
);

public record GroupConfigDto(
    Guid Key,
    string Name,
    int DisplaySequence,
    Guid GroupTypeId,
    IReadOnlyCollection<ComponentConfigDto> Components
) : OrderableEntityDto(
    Key: Key,
    Name: Name, 
    DisplaySequence: DisplaySequence
);

public record ComponentConfigDto(
    Guid Key,
    string Name,
    int DisplaySequence,
    Guid GroupId,
    Guid? DefaultPhysicalAllocationId = null
) : OrderableEntityDto(
    Key: Key,
    Name: Name,
    DisplaySequence: DisplaySequence
)
{
    public Component ToComponent() =>
        new()
        {
            Id = Key,
            Name = Name,
            DisplaySequence = DisplaySequence,
            GroupId = GroupId,
            DefaultPhysicalAllocationId = DefaultPhysicalAllocationId
        };  
}