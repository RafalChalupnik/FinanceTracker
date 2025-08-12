using FinanceTracker.Core.Extensions;
using FinanceTracker.Core.Interfaces;
using FinanceTracker.Core.Primitives;
using FinanceTracker.Core.Queries.DTOs;
using FinanceTracker.Core.Queries.Implementation;
using FinanceTracker.Core.Queries.Implementation.DTOs;
using Microsoft.EntityFrameworkCore;

namespace FinanceTracker.Core.Queries;

public class ValueHistoryQueries(FinanceTrackerContext dbContext)
{
    public EntityTableDto<ValueHistoryRecordDto> ForAssets(DateGranularity? granularity, DateOnly? from, DateOnly? to)
    {
        var orderedEntities = GetEntitiesWithValueHistory<Asset>()
            .OrderBy(x => x.DisplaySequence)
            .AsEnumerable()
            .Select(BuildEntityData)
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

    public EntityTableDto<ValueHistoryRecordDto> ForDebts(DateGranularity? granularity, DateOnly? from, DateOnly? to)
    {
        var orderedEntities = GetEntitiesWithValueHistory<Debt>()
            .OrderBy(x => x.DisplaySequence)
            .AsEnumerable()
            .Select(BuildEntityData)
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
    
    public EntityTableDto<ValueHistoryRecordDto> ForEntirePortfolio(DateGranularity? granularity, DateOnly? from, DateOnly? to)
    {
        EntityData[] entities =
        [
            MapEntities(GetWallets(includeTargets: false).ToArray(), "Wallets"),
            MapEntities(GetEntitiesWithValueHistory<Asset>().ToArray(), "Assets"),
            MapEntities(GetEntitiesWithValueHistory<Debt>().ToArray(), "Debts"),
        ];

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
            .First(x => x.Id == physicalAllocationId)!;

        var valuesGroupedByComponent = allocation.ValueHistory
            .Where(value => value.Component != null)
            .GroupBy(x => x.Component!);

        var orderedEntities = valuesGroupedByComponent
            .OrderBy(x => x.Key.DisplaySequence)
            .Select(componentValues =>
            {
                var orderedValues = componentValues
                    .OrderByDescending(x => x.Date)
                    .ToArray();

                return new EntityData(
                    Id: componentValues.Key.Id,
                    Name: componentValues.Key.Name,
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
                            ExactDate: historicValue.Date == date
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

    public EntityTableDto<WalletComponentsValueHistoryRecordDto> ForWallet(Guid walletId, DateGranularity? granularity, DateOnly? from, DateOnly? to)
    {
        var wallet = GetWallets(includeTargets: true)
            .First(wallet => wallet.Id == walletId);
        
        var orderedComponents = wallet.Components
            .OrderBy(component => component.DisplaySequence)
            .Select(BuildEntityData)
            .ToArray();
        
        var targets = wallet.Targets
            .OrderByDescending(x => x.Date)
            .ToArray();

        return EntityTableDtoBuilder.BuildEntityTableDto(
            orderedEntities: orderedComponents,
            rows: BuildWalletComponentsRows(orderedComponents, targets, granularity, from, to)
        );
    }
    
    public EntityTableDto<WalletValueHistoryRecordDto> ForWallets(DateGranularity? granularity, DateOnly? from, DateOnly? to)
    {
        if (granularity is DateGranularity.Date or DateGranularity.Week)
        {
            throw new ArgumentException("Granularity must be greater or equal to month.", nameof(granularity));
        }

        var orderedEntities = GetWallets(includeTargets: false)
            .OrderBy(wallet => wallet.DisplaySequence)
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

    private static WalletComponentsValueHistoryRecordDto[] BuildWalletComponentsRows(
        IReadOnlyList<EntityData> orderedComponents,
        IReadOnlyList<WalletTarget> targets,
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
            .Select(record => record.ToWalletComponentsValueHistoryRecord(
                target: BuildTargetData(record, targets)
            ))
            .ToArray();
    }

    private static WalletTargetDto? BuildTargetData(ValueRecord record, IReadOnlyCollection<WalletTarget> targets)
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

    private static EntityData MapEntities<T>(
        IReadOnlyCollection<T> entities, 
        string name
    ) where T : IEntityWithValueHistory, IOrderableEntity
    {
        var dates = entities
            .SelectMany(date => date.GetEvaluationDates())
            .ToArray();
        
        return new EntityData(
            Id: null,
            Name: name,
            Dates: dates,
            GetValueForDate: date => entities
                .Select(entity => entity.GetValueFor(date))
                .WhereNotNull()
                .Select(moneyValue => moneyValue.Value)
                .ToArray()
                .Sum(mainCurrency: "PLN")
                .ToEntityValueSnapshotDto()
        );
    }
    
    private static EntityData BuildEntityData<T>(T entity) where T : IEntityWithValueHistory, IOrderableEntity =>
        new EntityData(
            Name: entity.Name,
            Dates: entity.GetEvaluationDates().ToArray(),
            GetValueForDate: date => entity.GetValueFor(date).ToEntityValueSnapshotDto(),
            Id: entity.Id
        );
    
    private IQueryable<T> GetEntitiesWithValueHistory<T>() where T : EntityWithValueHistory =>
        dbContext.Set<T>()
            .Include(x => x.ValueHistory);
    
    private IQueryable<Wallet> GetWallets(bool includeTargets)
    {
        var query = dbContext.Wallets
            .Include(x => x.Components)
            .ThenInclude(x => x.ValueHistory);

        return includeTargets
            ? query.Include(x => x.Targets)
            : query;
    }
}