using FinanceTracker.Core.Entities;
using FinanceTracker.Core.Extensions;
using FinanceTracker.Core.Primitives;
using FinanceTracker.Core.Queries.DTOs;
using FinanceTracker.Core.Queries.Implementation;
using FinanceTracker.Core.Queries.Implementation.DTOs;
using Microsoft.EntityFrameworkCore;

namespace FinanceTracker.Core.Queries;

public class ValueHistoryQueries(FinanceTrackerContext dbContext)
{
    public EntityTableDto<ValueHistoryRecordDto> ForEntirePortfolio(DateGranularity? granularity, DateOnly? from, DateOnly? to)
    {
        var groupsByType = dbContext.Groups
            .Include(group => group.GroupType)
            .Include(group => group.Components)
            .ThenInclude(component => component.ValueHistory)
            .AsEnumerable()
            .GroupBy(group => group.GroupType)
            .OrderBy(grouping => grouping.Key!.DisplaySequence)
            .ToArray();

        var entities = groupsByType
            .Select(groupsInType => MapGroups(groupsInType.ToArray(), groupsInType.Key!.Name))
            .ToArray();

        var records = RecordsBuilder.BuildValueRecords(
            orderedEntities: entities,
            granularity,
            fromDate: from,
            toDate: to
        );

        return EntityTableDtoBuilder.BuildEntityTableDto(
            orderedEntities: entities,
            rows: records
                .Select(record => record.ToValueHistoryRecord())
                .ToArray()
        );
    }
    
    public EntityTableDto<ValueHistoryRecordDto> ForPhysicalAllocations(
        Guid physicalAllocationId, 
        DateGranularity? granularity, 
        DateOnly? from, 
        DateOnly? to
        )
    {
        var allocation = dbContext.PhysicalAllocations
            .Include(x => x.ValueHistory)
            .ThenInclude(x => x.Component)
            .ThenInclude(x => x.Wallet)
            .First(x => x.Id == physicalAllocationId)!;

        var valuesGroupedByComponent = allocation.ValueHistory
            .Where(value => value.Component != null)
            .GroupBy(x => x.Component!);

        var orderedEntities = valuesGroupedByComponent
            .OrderBy(x => x.Key.Wallet?.DisplaySequence ?? 0)
            .ThenBy(x => x.Key.DisplaySequence)
            .Select(componentValues =>
            {
                var orderedValues = componentValues
                    .OrderByDescending(x => x.Date)
                    .ToArray();

                return new EntityData(
                    Id: componentValues.Key.Id,
                    Name: componentValues.Key.Name,
                    ParentName: componentValues.Key.Wallet?.Name,
                    DefaultPhysicalAllocationId: null,
                    Dates: orderedValues.Select(x => x.Date).Distinct().ToArray(),
                    GetValueForDate: date =>
                    {
                        // TODO: Make an extension method from EntityWithValueHistory

                        var historicValue = orderedValues
                            .FirstOrDefault(x => x.Date <= date);
                        // .Value;

                        if (historicValue == null)
                        {
                            return null;
                        }

                        return new MoneyValue(
                            Value: historicValue.Value,
                            ExactDate: historicValue.Date == date,
                            PhysicalAllocationId: physicalAllocationId
                        ).ToEntityValueSnapshotDto();
                    }
                );
            })
            .ToArray();
        
        var records = RecordsBuilder.BuildValueRecords(
            orderedEntities: orderedEntities,
            granularity,
            fromDate: from,
            toDate: to
        );
        
        return EntityTableDtoBuilder.BuildEntityTableDto(
            orderedEntities: orderedEntities,
            rows: records
                .Select(record => record.ToValueHistoryRecord())
                .ToArray()
        );
    }
    
    public EntityTableDto<ValueHistoryRecordDto> ForGroup(Guid groupId, DateGranularity? granularity, DateOnly? from,
        DateOnly? to)
    {
        var group = dbContext.Groups
            .Include(group => group.Components)
            .ThenInclude(component => component.ValueHistory)
            .First(group => group.Id == groupId);
        
        var orderedComponents = group.Components
            .OrderBy(component => component.DisplaySequence)
            .Select(BuildEntityData)
            .ToArray();
        
        // TODO
        // var targets = wallet.Targets
        //     .OrderByDescending(x => x.Date)
        //     .ToArray();
        
        return EntityTableDtoBuilder.BuildEntityTableDto(
            orderedEntities: orderedComponents,
            rows: BuildGroupComponentsRows(orderedComponents, granularity, from, to)
        );
    }

    public EntityTableDto<WalletValueHistoryRecordDto> ForWallets(DateGranularity? granularity, DateOnly? from, DateOnly? to)
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
            .Select(BuildEntityData)
            .ToArray();
        
        var records = RecordsBuilder.BuildValueRecords(
            orderedEntities, 
            granularity ?? DateGranularity.Month, 
            fromDate: from, 
            toDate: to
        );

        var inflationValues = dbContext.InflationValues;

        var rows = records
            .Select(record => record.ToWalletValueHistoryRecord(
                BuildYieldDto(record, inflationValues)
            ))
            .ToArray();

        return EntityTableDtoBuilder.BuildEntityTableDto(
            orderedEntities,
            rows
        );
    }
    
    private static ValueHistoryRecordDto[] BuildGroupComponentsRows(
        IReadOnlyList<EntityData> orderedComponents,
        DateGranularity? granularity, 
        DateOnly? from, 
        DateOnly? to)
    {
        var records = RecordsBuilder.BuildValueRecords(
            orderedComponents, 
            granularity, 
            fromDate: from, 
            toDate: to
        );

        return records
            .Select(record => record.ToValueHistoryRecord())
            .ToArray();
    }

    private static WalletTargetDto? BuildTargetData(ValueRecord record, IReadOnlyCollection<HistoricTarget> targets)
    {
        var target = targets.FirstOrDefault(target => target.Date <= record.DateRange.To);

        if (target == null || target.ValueInMainCurrency == 0)
        {
            return null;
        }
        
        var percentage = record.Summary.Value.AmountInMainCurrency / target.ValueInMainCurrency;
        
        return new WalletTargetDto(
            TargetInMainCurrency: target.ValueInMainCurrency,
            Percentage: decimal.Round(percentage * 100, decimals: 2)
        );
    }

    private static YieldDto BuildYieldDto(
        ValueRecord record,
        IEnumerable<InflationHistoricValue> inflationValues)
    {
        var inflation = AggregateInflation(inflationValues, record.DateRange);

        var previousValue = record.Summary.Value.AmountInMainCurrency - record.Summary.Change.AmountInMainCurrency;
        var currentValue = record.Summary.Value.AmountInMainCurrency;

        var changePercent = decimal.Round(currentValue * 100 / previousValue, decimals: 2) - 100;
        
        return new YieldDto(
            ChangePercent: changePercent,
            Inflation: inflation,
            TotalChangePercent: changePercent - (inflation?.Value ?? 0)
        );
    }

    private static InflationDto? AggregateInflation(
        IEnumerable<InflationHistoricValue> inflationValues,
        DateRange dateRange)
    {
        var inflationPoints = inflationValues
            .Where(dataPoint => dataPoint.FitsInRange(dateRange.From, dateRange.To))
            .OrderBy(dataPoint => dataPoint.Year)
            .ThenBy(dataPoint => dataPoint.Month)
            .ToArray();
        
        if (inflationPoints.Length == 0)
        {
            return null;
        }
        
        var inflation = inflationPoints.Aggregate(1m, (a, b) => a * (1 + b.Value));

        return new InflationDto(
            Value: decimal.Round((inflation - 1) * 100, decimals: 2),
            Confirmed: inflationPoints.All(dataPoint => dataPoint.Confirmed)
        );
    }

    private static EntityData MapGroups(IReadOnlyCollection<Group> groups, string name)
    {
        var dates = groups
            .SelectMany(date => date.GetEvaluationDates())
            .ToArray();
        
        return new EntityData(
            Id: null,
            Name: name,
            ParentName: null,
            Dates: dates,
            DefaultPhysicalAllocationId: null,
            GetValueForDate: date => groups
                .Select(entity => entity.GetValueFor(date))
                .WhereNotNull()
                .Select(moneyValue => moneyValue.Value)
                .ToArray()
                .Sum(mainCurrency: "PLN")
                .ToEntityValueSnapshotDto()
        );
    }
    
    private static EntityData BuildEntityData(Component component) =>
        new EntityData(
            Name: component.Name,
            ParentName: component.Wallet?.Name,
            Dates: component.GetEvaluationDates().ToArray(),
            DefaultPhysicalAllocationId: component.DefaultPhysicalAllocationId,
            GetValueForDate: date => component.GetValueFor(date).ToEntityValueSnapshotDto(),
            Id: component.Id
        );
    
    private static EntityData BuildEntityData(Group group) =>
        new EntityData(
            Name: group.Name,
            ParentName: null,
            Dates: group.GetEvaluationDates().ToArray(),
            DefaultPhysicalAllocationId: null,
            GetValueForDate: date => group.GetValueFor(date).ToEntityValueSnapshotDto(),
            Id: group.Id
        );
}