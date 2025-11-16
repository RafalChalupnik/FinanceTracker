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
    bool ShowScore,
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
    bool ShowTargets,
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
    public static ComponentConfigDto FromComponent(Component component) =>
        new ComponentConfigDto(
            Key: component.Id,
            Name: component.Name,
            DisplaySequence: component.DisplaySequence,
            GroupId: component.GroupId,
            DefaultPhysicalAllocationId: component.DefaultPhysicalAllocationId
        );
    
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