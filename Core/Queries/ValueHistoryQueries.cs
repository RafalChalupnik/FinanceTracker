using FinanceTracker.Core.Extensions;
using FinanceTracker.Core.Interfaces;
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

    public WalletsPerDateQueryDto ForWalletsAndComponents(DateGranularity? granularity, DateOnly? from, DateOnly? to)
    {
        var wallets = repository
            .GetWallets(includeValueHistory: true, includeTargets: true)
            .ToArray();

        return new WalletsPerDateQueryDto(
            Wallets: wallets
                .OrderBy(wallet => wallet.DisplaySequence)
                .Select(wallet => new WalletDto(
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
    
    public EntitiesPerDateQueryDto ForWallets(DateGranularity? granularity, DateOnly? from, DateOnly? to) =>
        EntitiesPerDateViewDtoFactory.BuildEntitiesPerDateViewDto(
            entities: repository.GetWallets(includeValueHistory: true, includeTargets: false),
            granularity,
            fromDate: from,
            toDate: to
        );

    private IReadOnlyCollection<WalletForDateDto> BuildWalletForDates(
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
            .Select(dataForDate => new WalletForDateDto(
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