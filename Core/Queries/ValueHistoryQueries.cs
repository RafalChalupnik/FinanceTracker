using FinanceTracker.Core.Extensions;
using FinanceTracker.Core.Interfaces;
using FinanceTracker.Core.Primitives;
using FinanceTracker.Core.Queries.DTOs;
using FinanceTracker.Core.Queries.Implementation;

namespace FinanceTracker.Core.Queries;

public class ValueHistoryQueries(IRepository repository)
{
    public EntitiesPerDateQueryDto ForAssets(DateGranularity? granularity, DateOnly? from, DateOnly? to) =>
        EntitiesPerDateViewDtoFactory.BuildEntitiesPerDateViewDto(
            entities: repository.GetEntitiesWithValueHistory<Asset>(),
            granularity,
            fromDate: from,
            toDate: to
        );
    
    public EntitiesPerDateQueryDto ForDebts(DateGranularity? granularity, DateOnly? from, DateOnly? to) =>
        EntitiesPerDateViewDtoFactory.BuildEntitiesPerDateViewDto(
            entities: repository.GetEntitiesWithValueHistory<Debt>(),
            granularity,
            fromDate: from,
            toDate: to
        );
    
    public EntitiesPerDateQueryDto ForEntirePortfolio(DateGranularity? granularity, DateOnly? from, DateOnly? to)
    {
        EntitiesPerDateViewDtoFactory.EntityData[] entities =
        [
            MapEntities(repository.GetWallets(includeValueHistory: true, includeTargets: false).ToArray(), "Wallets"),
            MapEntities(repository.GetEntitiesWithValueHistory<Asset>().ToArray(), "Assets"),
            MapEntities(repository.GetEntitiesWithValueHistory<Debt>().ToArray(), "Debts"),
        ];

        return EntitiesPerDateViewDtoFactory.BuildEntitiesPerDateViewDto(
            entities,
            granularity,
            fromDate: from,
            toDate: to
        );
    }

    public WalletsComponentsPerDateQueryDto ForWalletsAndComponents(DateGranularity? granularity, DateOnly? from, DateOnly? to)
    {
        var wallets = repository
            .GetWallets(includeValueHistory: true, includeTargets: true)
            .ToArray();

        return new WalletsComponentsPerDateQueryDto(
            Wallets: wallets
                .OrderBy(wallet => wallet.DisplaySequence)
                .Select(wallet => new WalletComponentsDto(
                        Id: wallet.Id,
                        Name: wallet.Name,
                        Headers: wallet.Components
                            .OrderBy(x => x.DisplaySequence)
                            .Select(entity => new EntityHeaderDto(
                                    Name: entity.Name,
                                    Id: entity.Id
                                )
                            )
                            .ToArray(),
                        Data: BuildWalletForDates(wallet, granularity, from, to)
                    )
                )
                .ToArray()
        );
    }
    
    public WalletsPerDateQueryDto ForWallets(DateGranularity? granularity, DateOnly? from, DateOnly? to)
    {
        var data = EntitiesPerDateViewDtoFactory.BuildEntitiesPerDateViewDto(
            entities: repository.GetWallets(includeValueHistory: true, includeTargets: false),
            granularity,
            fromDate: from,
            toDate: to
        );

        return new WalletsPerDateQueryDto(
            Headers: data.Headers,
            Data: BuildWalletsForDateDto(data.Data)
        );
    }

    private static IReadOnlyCollection<WalletComponentsForDateDto> BuildWalletForDates(
        Wallet wallet,
        DateGranularity? granularity, 
        DateOnly? from, 
        DateOnly? to)
    {
        var data = EntitiesPerDateViewDtoFactory
            .BuildEntitiesPerDateViewDto(
                wallet.Components,
                granularity,
                fromDate: from,
                toDate: to
            )
            .Data;

        var targets = wallet.Targets
            .OrderByDescending(x => x.Date)
            .ToArray();

        return data
            .Select(dataForDate => new WalletComponentsForDateDto(
                    Key: dataForDate.Key,
                    Entities: dataForDate.Entities,
                    Summary: dataForDate.Summary,
                    Target: BuildTargetData(dataForDate, targets)
                )
            )
            .ToArray();
    }

    private static WalletTargetDto? BuildTargetData(EntitiesForDateDto data, IReadOnlyCollection<WalletTarget> targets)
    {
        var target = targets.FirstOrDefault(target => target.Date <= data.Date);

        if (target == null || target.ValueInMainCurrency == 0)
        {
            return null;
        }
        
        var percentage = data.Summary.Value.AmountInMainCurrency / target.ValueInMainCurrency;
        
        return new WalletTargetDto(
            TargetInMainCurrency: target.ValueInMainCurrency,
            Percentage: decimal.Round(percentage * 100, decimals: 2)
        );
    }

    private WalletsForDateDto[] BuildWalletsForDateDto(IEnumerable<EntitiesForDateDto> rows)
    {
        var inflationValues = repository.GetEntities<InflationHistoricValue>()
            .OrderByDescending(x => x.Date)
            .ToArray();
        
        return rows
            .Select(dataForDate => new WalletsForDateDto(
                    Key: dataForDate.Key,
                    Entities: dataForDate.Entities,
                    Summary: dataForDate.Summary,
                    Yield: BuildYieldDto(dataForDate, inflationValues)
                )
            )
            .ToArray();
    }

    private static YieldDto BuildYieldDto(
        EntitiesForDateDto row,
        IEnumerable<InflationHistoricValue> inflationValues)
    {
        var inflation = inflationValues.FirstOrDefault(value => value.Date <= row.Date)?.Value?? 0;

        var previousValue = row.Summary.Value.AmountInMainCurrency - row.Summary.Change.AmountInMainCurrency;
        var currentValue = row.Summary.Value.AmountInMainCurrency;

        var changePercent = decimal.Round(currentValue * 100 / previousValue, decimals: 2) - 100;
        
        return new YieldDto(
            ChangePercent: changePercent,
            Inflation: inflation,
            TotalChangePercent: changePercent - inflation
        );
    }

    private static EntitiesPerDateViewDtoFactory.EntityData MapEntities<T>(
        IReadOnlyCollection<T> entities, 
        string name
    ) where T : IEntityWithValueHistory, IOrderableEntity
    {
        var dates = entities
            .SelectMany(date => date.GetEvaluationDates())
            .ToArray();
        
        return new EntitiesPerDateViewDtoFactory.EntityData(
            Name: name,
            Dates: dates,
            GetValueForDate: date => entities
                .Select(entity => entity.GetValueFor(date))
                .WhereNotNull()
                .ToArray()
                .Sum(mainCurrency: "PLN")
                .ToValueSnapshotDto(),
            Id: null
        );
    }
}