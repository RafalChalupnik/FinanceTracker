using FinanceTracker.Core.Entities;

namespace FinanceTracker.Core.Queries.DTOs;

public record GroupTypeDto(
    Guid Key,
    string Name,
    int DisplaySequence,
    string Icon,
    bool ShowScore
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
            DisplaySequence = DisplaySequence,
            ShowScore = ShowScore
        };
}

public record GroupDto(
    Guid Key,
    string Name,
    int DisplaySequence,
    bool ShowTargets,
    Guid GroupTypeId
)
{
    public Group ToGroup() =>
        new()
        {
            Id = Key,
            Name = Name,
            DisplaySequence = DisplaySequence,
            ShowTargets = ShowTargets,
            GroupTypeId = GroupTypeId
        };
}

public record OrderableEntityDto(
    Guid Key,
    string Name,
    int DisplaySequence
)
{
    public PhysicalAllocation ToPhysicalAllocation() =>
        new()
        {
            Id = Key,
            Name = Name,
            DisplaySequence = DisplaySequence
        };
}