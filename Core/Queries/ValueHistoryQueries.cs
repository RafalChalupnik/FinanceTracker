using FinanceTracker.Core.Entities;
using FinanceTracker.Core.Queries.DTOs;
using FinanceTracker.Core.Queries.Implementation;
using FinanceTracker.Core.Queries.Implementation.DTOs;
using Microsoft.EntityFrameworkCore;

namespace FinanceTracker.Core.Queries;

public class ValueHistoryQueries(FinanceTrackerContext dbContext)
{
    public EntityTableDto ForEntirePortfolio(DateGranularity? granularity, DateOnly? from, DateOnly? to)
    {
        var entities = dbContext.Groups
            .Include(group => group.GroupType)
            .Include(group => group.Components)
            .ThenInclude(component => component.ValueHistory)
            .AsEnumerable()
            .GroupBy(group => group.GroupType)
            .OrderBy(grouping => grouping.Key!.DisplaySequence)
            .Select(groupsInType => EntityData.FromGroups(groupsInType.Key!.Name, groupsInType.ToArray()))
            .ToArray();
        
        return BuildEntityTableDto(entities, granularity, from, to);
    }
    
    public EntityTableDto ForGroupType(Guid groupTypeId, DateGranularity? granularity, DateOnly? from, DateOnly? to)
    {
        if (granularity is DateGranularity.Date or DateGranularity.Week)
        {
            throw new ArgumentException("Granularity must be greater or equal to month.", nameof(granularity));
        }
        
        var groupType = dbContext.GroupTypes
            .Include(groupType => groupType.Groups)
            .ThenInclude(group => group.Components)
            .ThenInclude(component => component.ValueHistory)
            .First(groupType => groupType.Id == groupTypeId);
        
        var orderedEntities = groupType.Groups
            .OrderBy(group => group.DisplaySequence)
            .AsEnumerable()
            .Select(EntityData.FromGroup)
            .ToArray();

        var inflationValues = groupType.ShowScore
            ? dbContext.InflationValues
            : null;
        
        return BuildEntityTableDto(orderedEntities, granularity, from, to, null, inflationValues);
    }
    
    public EntityTableDto ForGroup(Guid groupId, DateGranularity? granularity, DateOnly? from,
        DateOnly? to)
    {
        var group = dbContext.Groups
            .Include(group => group.Targets)
            .Include(group => group.Components)
            .ThenInclude(component => component.ValueHistory)
            .First(group => group.Id == groupId);
        
        var orderedComponents = group.Components
            .OrderBy(component => component.DisplaySequence)
            .Select(EntityData.FromComponent)
            .ToArray();
        
        var targets = group.ShowTargets
            ? group.Targets
                .OrderByDescending(x => x.Date)
                .ToArray()
            : [];
        
        return BuildEntityTableDto(orderedComponents, granularity, from, to, targets);
    }
    
    public EntityTableDto ForPhysicalAllocations(
        Guid physicalAllocationId, 
        DateGranularity? granularity, 
        DateOnly? from, 
        DateOnly? to
        )
    {
        var orderedEntities = dbContext.PhysicalAllocations
            .Include(x => x.ValueHistory)
            .ThenInclude(x => x.Component)
            .ThenInclude(x => x!.Group)
            .First(x => x.Id == physicalAllocationId)
            .ValueHistory
            .Where(value => value.Component != null)
            .GroupBy(x => x.Component!)
            .OrderBy(x => x.Key.Group?.DisplaySequence ?? 0)
            .ThenBy(x => x.Key.DisplaySequence)
            .Select(componentValues => EntityData.FromComponentValues(
                component: componentValues.Key, 
                values: componentValues, 
                physicalAllocationId: physicalAllocationId
                )
            )
            .ToArray();

        return BuildEntityTableDto(orderedEntities, granularity, from, to);
    }

    public EntityTableDto ForWallets(DateGranularity? granularity, DateOnly? from, DateOnly? to)
    {
        if (granularity is DateGranularity.Date or DateGranularity.Week)
        {
            throw new ArgumentException("Granularity must be greater or equal to month.", nameof(granularity));
        }

        var orderedEntities = dbContext.GroupTypes
            .Where(groupType => groupType.Name == "Wallets")
            .Include(groupType => groupType.Groups)
            .ThenInclude(group => group.Components)
            .ThenInclude(component => component.ValueHistory)
            .SelectMany(groupType => groupType.Groups)
            .OrderBy(group => group.DisplaySequence)
            .AsEnumerable()
            .Select(EntityData.FromGroup)
            .ToArray();
        
        var inflationValues = dbContext.InflationValues;

        return BuildEntityTableDto(orderedEntities, granularity, from, to, null, inflationValues);
    }
    
    private static EntityTableDto BuildEntityTableDto(
        IReadOnlyList<EntityData> entities, 
        DateGranularity? granularity, DateOnly? from, DateOnly? to,
        IReadOnlyCollection<HistoricTarget>? targets = null,
        IEnumerable<InflationHistoricValue>? inflation = null)
    {
        var records = RecordsBuilder.BuildValueRecords(
            orderedEntities: entities,
            granularity,
            fromDate: from,
            toDate: to
        );

        return new EntityTableDto(
            Columns: entities
                .Select(entity => new EntityColumnDto(
                        Id: entity.Id ?? Guid.Empty,
                        Name: entity.Name,
                        ParentName: entity.ParentName,
                        DefaultPhysicalAllocationId: entity.DefaultPhysicalAllocationId
                    )
                )
                .ToArray(),
            Rows: records
                .Select(record => record.ToValueHistoryRecord(
                    target: targets?.FirstOrDefault(target => target.Date <= record.DateRange.To),
                    inflation: inflation != null
                        ? InflationAggregator.AggregateInflation(inflation, record.DateRange)
                        : null
                )
            )
            .ToArray()
        );
    }
}