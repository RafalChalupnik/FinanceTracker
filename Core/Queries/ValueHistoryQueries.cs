using FinanceTracker.Core.Extensions;
using FinanceTracker.Core.Interfaces;
using FinanceTracker.Core.Queries.DTOs;
using FinanceTracker.Core.Queries.Implementation;

namespace FinanceTracker.Core.Queries;

public class ValueHistoryQueries(IRepository repository)
{
    public EntitiesPerDateQueryDto ForAssets() =>
        EntitiesPerDateViewDtoFactory.BuildEntitiesPerDateViewDto(
            entities: repository.GetEntitiesWithValueHistory<Asset>()
        );
    
    public EntitiesPerDateQueryDto ForDebts() =>
        EntitiesPerDateViewDtoFactory.BuildEntitiesPerDateViewDto(
            entities: repository.GetEntitiesWithValueHistory<Debt>()
        );
    
    public EntitiesPerDateQueryDto ForEntirePortfolio()
    {
        EntitiesPerDateViewDtoFactory.EntityData[] entities =
        [
            MapEntities(repository.GetWallets(includeValueHistory: true).ToArray(), "Wallets"),
            MapEntities(repository.GetEntitiesWithValueHistory<Asset>().ToArray(), "Assets"),
            MapEntities(repository.GetEntitiesWithValueHistory<Debt>().ToArray(), "Debts"),
        ];

        return EntitiesPerDateViewDtoFactory.BuildEntitiesPerDateViewDto(entities);
    }

    public WalletsPerDateQueryDto ForWalletsAndComponents()
    {
        var wallets = repository
            .GetWallets(includeValueHistory: true)
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
                        Data: EntitiesPerDateViewDtoFactory
                            .BuildEntitiesPerDateViewDto(wallet.Components)
                            .Data
                    )
                )
                .ToArray()
        );
    }
    
    public EntitiesPerDateQueryDto ForWallets() =>
        EntitiesPerDateViewDtoFactory.BuildEntitiesPerDateViewDto(
            entities: repository.GetWallets(includeValueHistory: true)
        );
    
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