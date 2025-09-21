using FinanceTracker.Core.Entities;
using FinanceTracker.Core.Queries.DTOs;

namespace FinanceTracker.Core.DTOs;

public record GroupDto(
    Guid Key,
    string Name,
    int DisplaySequence,
    Guid GroupTypeId
) : OrderableEntityDto(
    Key,
    Name,
    DisplaySequence
)
{
    public static GroupDto FromEntity(Group entity) =>
        new(
            Key: entity.Id,
            Name: entity.Name,
            DisplaySequence: entity.DisplaySequence,
            GroupTypeId: entity.GroupTypeId
        );

    public Group ToGroup() =>
        new()
        {
            Id = Key,
            Name = Name,
            DisplaySequence = DisplaySequence,
            GroupTypeId = GroupTypeId
        };
}