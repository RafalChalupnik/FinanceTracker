using FinanceTracker.Core.Extensions;
using FinanceTracker.Core.Interfaces;
using FinanceTracker.Core.Queries.DTOs;
using FinanceTracker.Core.Queries.Implementation;
using FinanceTracker.Core.Queries.Implementation.DTOs;

namespace FinanceTracker.Core.Queries;

public class ValueHistoryQueries(IRepository repository)
{
    public EntityTableDto<ValueHistoryRecordDto> ForAssets(DateGranularity? granularity, DateOnly? from, DateOnly? to)
    {
        var orderedEntities = repository.GetEntitiesWithValueHistory<Asset>()
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
        var orderedEntities = repository.GetEntitiesWithValueHistory<Debt>()
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
            MapEntities(repository.GetWallets(includeValueHistory: true, includeTargets: false).ToArray(), "Wallets"),
            MapEntities(repository.GetEntitiesWithValueHistory<Asset>().ToArray(), "Assets"),
            MapEntities(repository.GetEntitiesWithValueHistory<Debt>().ToArray(), "Debts"),
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

    public WalletsComponentsDto ForWalletsAndComponents(DateGranularity? granularity, DateOnly? from, DateOnly? to)
    {
        var wallets = repository
            .GetWallets(includeValueHistory: true, includeTargets: true)
            .ToArray();

        return new WalletsComponentsDto(
            Wallets: wallets
                .OrderBy(wallet => wallet.DisplaySequence)
                .Select(wallet => EntityTableDtoBuilder.BuildWalletComponentsTableDto(
                        wallet: wallet,
                        rows: BuildWalletComponentsRows(wallet, granularity, from, to)
                    )
                )
                .ToArray()
        );
    }
    
    public EntityTableDto<WalletValueHistoryRecordDto> ForWallets(DateGranularity? granularity, DateOnly? from, DateOnly? to)
    {
        if (granularity is DateGranularity.Date or DateGranularity.Week)
        {
            throw new ArgumentException("Granularity must be greater or equal to month.", nameof(granularity));
        }

        var orderedEntities = repository.GetWallets(includeValueHistory: true, includeTargets: false)
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

        var inflationValues = repository.GetEntities<InflationHistoricValue>().ToArray();

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
        Wallet wallet,
        DateGranularity? granularity, 
        DateOnly? from, 
        DateOnly? to)
    {
        var orderedComponents = wallet.Components
            .OrderBy(component => component.DisplaySequence)
            .Select(BuildEntityData)
            .ToArray();
        
        var records = RecordsBuilder.BuildValueRecords(
            orderedComponents, 
            granularity, 
            fromDate: from, 
            toDate: to
        );

        var targets = wallet.Targets
            .OrderByDescending(x => x.Date)
            .ToArray();

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
            TotalChangePercent: changePercent - (inflation ?? 0)
        );
    }

    private static decimal? AggregateInflation(
        IEnumerable<InflationHistoricValue> inflationValues,
        DateRange dateRange)
    {
        var inflationPoints = inflationValues
            .Where(dataPoint => dataPoint.FitsInRange(dateRange.From, dateRange.To))
            .OrderBy(dataPoint => dataPoint.Year)
            .ThenBy(dataPoint => dataPoint.Month)
            .Select(dataPoint => dataPoint.Value / 100)
            .ToArray();
        
        if (inflationPoints.Length == 0)
        {
            return null;
        }
        
        var inflation = inflationPoints.Aggregate(1m, (a, b) => a * (1 + b));
        
        return decimal.Round((inflation - 1) * 100, decimals: 2);
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
                .ToArray()
                .Sum(mainCurrency: "PLN")
                .ToValueSnapshotDto()
        );
    }
    
    private static EntityData BuildEntityData<T>(T entity) where T : IEntityWithValueHistory, IOrderableEntity =>
        new EntityData(
            Name: entity.Name,
            Dates: entity.GetEvaluationDates().ToArray(),
            GetValueForDate: date => entity.GetValueFor(date).ToValueSnapshotDto(),
            Id: entity.Id
        );
}