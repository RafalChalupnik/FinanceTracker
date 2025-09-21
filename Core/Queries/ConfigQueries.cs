using FinanceTracker.Core.Entities;
using FinanceTracker.Core.Extensions;
using FinanceTracker.Core.Interfaces;
using FinanceTracker.Core.Queries.DTOs;
using Microsoft.EntityFrameworkCore;

namespace FinanceTracker.Core.Queries;

public class ConfigQueries(FinanceTrackerContext dbContext)
{
    public ConfigurationDto GetConfiguration()
    {
        return new ConfigurationDto(
            Assets: GetOrderableEntities<Asset>(),
            Debts: GetOrderableEntities<Debt>(),
            Wallets: GetWalletsWithComponents(),
            PhysicalAllocations: GetOrderableEntities<PhysicalAllocation>()
        );
    }

    public IReadOnlyCollection<GroupTypeDto> GetGroupTypes() =>
        dbContext.GroupTypes
            .OrderBy(groupType => groupType.DisplaySequence)
            .AsEnumerable()
            .Select(groupType => new GroupTypeDto(
                Key: groupType.Id,
                Name: groupType.Name,
                DisplaySequence: groupType.DisplaySequence,
                Icon: groupType.IconName
            ))
            .ToArray();

    public IReadOnlyCollection<GroupTypeWithGroupsDto> GetGroups()
    {
        return dbContext.Groups
            .Include(x => x.GroupType)
            .GroupBy(x => x.GroupType)
            .AsEnumerable()
            .OrderBy(x => x.Key!.DisplaySequence)
            .Select(grouping => new GroupTypeWithGroupsDto(
                Key: grouping.Key!.Id,
                Name: grouping.Key!.Name,
                Icon: grouping.Key!.IconName,
                DisplaySequence: grouping.Key!.DisplaySequence,
                Groups: grouping
                    .OrderBy(group => group.DisplaySequence)
                    .Select(group => new GroupDto(
                        Key: group.Id,
                        Name: group.Name,
                        DisplaySequence: group.DisplaySequence,
                        GroupTypeId: group.GroupTypeId
                        )
                    )
                    .ToArray()
                )
            )
            .ToArray();
    }

    public OrderableEntityDto[] GetWallets()
        => GetOrderableEntities<Wallet>();
    
    public OrderableEntityDto[] GetPhysicalAllocations()
        => GetOrderableEntities<PhysicalAllocation>();

    private OrderableEntityDto[] GetOrderableEntities<T>() where T : class, IOrderableEntity =>
        BuildOrderableEntityDtos(
            dbContext.Set<T>()
        );

    private WalletDataDto[] GetWalletsWithComponents()
    {
        return dbContext.Wallets
            .Include(x => x.Components)
            .AsEnumerable()
            .Select(wallet => new WalletDataDto(
                    wallet.Id,
                    wallet.Name,
                    wallet.DisplaySequence,
                    BuildOrderableEntityDtos(wallet.Components)
                )
            )
            .OrderBy(x => x.DisplaySequence)
            .ToArray();
    }
    
    private static WalletComponentDataDto[] BuildOrderableEntityDtos(
        IEnumerable<Component> components)
    {
        return components
            .Select(component => new WalletComponentDataDto(
                    Key: component.Id, 
                    Name: component.Name, 
                    DisplaySequence: component.DisplaySequence,
                    DefaultPhysicalAllocationId: component.DefaultPhysicalAllocationId
                )
            )
            .OrderBy(x => x.DisplaySequence)
            .ToArray();
    }

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