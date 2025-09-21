using FinanceTracker.Core.Interfaces;
using FinanceTracker.Core.Queries.DTOs;
using Microsoft.EntityFrameworkCore;

namespace FinanceTracker.Core.Queries;

public class ConfigQueries(FinanceTrackerContext dbContext)
{
    public ConfigurationDto GetConfiguration()
    {
        var groupTypes = dbContext.GroupTypes
            .Include(groupType => groupType.Groups)
            .ThenInclude(group => group.Components)
            .OrderBy(groupType => groupType.DisplaySequence)
            .AsEnumerable()
            .Select(groupType => new GroupTypeConfigDto(
                    Key: groupType.Id,
                    Name: groupType.Name,
                    DisplaySequence: groupType.DisplaySequence,
                    Icon: groupType.IconName,
                    Groups: groupType.Groups
                        .OrderBy(group => group.DisplaySequence)
                        .Select(group => new GroupConfigDto(
                                Key: group.Id,
                                Name: group.Name,
                                DisplaySequence: group.DisplaySequence,
                                GroupTypeId: groupType.Id,
                                Components: group.Components
                                    .OrderBy(component => component.DisplaySequence)
                                    .Select(component => new ComponentConfigDto(
                                            Key: component.Id,
                                            Name: component.Name,
                                            DisplaySequence: component.DisplaySequence,
                                            GroupId: component.GroupId,
                                            DefaultPhysicalAllocationId: component.DefaultPhysicalAllocationId
                                        )
                                    )
                                    .ToArray()
                            )
                        )
                        .ToArray()
                )
            )
            .ToArray();

        var physicalAllocations = BuildOrderableEntityDtos(dbContext.PhysicalAllocations);
        
        return new ConfigurationDto(groupTypes, physicalAllocations);
    }

    public OrderableEntityDto[] GetPhysicalAllocations()
        => GetOrderableEntities<PhysicalAllocation>();

    private OrderableEntityDto[] GetOrderableEntities<T>() where T : class, IOrderableEntity =>
        BuildOrderableEntityDtos(
            dbContext.Set<T>()
        );

    private static OrderableEntityDto[] BuildOrderableEntityDtos(
        IEnumerable<IOrderableEntity> entities)
    {
        return entities
            .Select(entity => new OrderableEntityDto(
                    Key: entity.Id, 
                    Name: entity.Name, 
                    DisplaySequence: entity.DisplaySequence
                )
            )
            .OrderBy(x => x.DisplaySequence)
            .ToArray();
    }
}