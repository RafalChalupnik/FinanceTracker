using FinanceTracker.Core.Interfaces;
using FinanceTracker.Core.Queries.DTOs;
using FinanceTracker.Core.Queries.Implementation;

namespace FinanceTracker.Core.Queries;

public class SummaryQueries(IRepository repository)
{
    public EntitiesPerDateQueryDto GetAssets() =>
        EntitiesPerDateViewDtoFactory.BuildEntitiesPerDateViewDto(
            entities: repository.GetEntitiesWithValueHistory<Asset>()
        );
    
    public EntitiesPerDateQueryDto GetDebts() =>
        EntitiesPerDateViewDtoFactory.BuildEntitiesPerDateViewDto(
            entities: repository.GetEntitiesWithValueHistory<Debt>()
        );
    
    public EntitiesPerDateQueryDto GetPortfolioSummary()
    {
        EntitiesPerDateViewDtoFactory.EntityData[] entities =
        [
            MapEntities(repository.GetWallets().ToArray(), "Wallets"),
            MapEntities(repository.GetEntitiesWithValueHistory<Asset>().ToArray(), "Assets"),
            MapEntities(repository.GetEntitiesWithValueHistory<Debt>().ToArray(), "Debts"),
        ];

        return EntitiesPerDateViewDtoFactory.BuildEntitiesPerDateViewDto(entities);
    }

    public WalletsPerDateQueryDto GetWallets()
    {
        var wallets = repository
            .GetWallets()
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
    
    public EntitiesPerDateQueryDto GetWalletsSummary() =>
        EntitiesPerDateViewDtoFactory.BuildEntitiesPerDateViewDto(
            entities: repository.GetWallets()
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
            GetValueForDate: date =>
            {
                var values = entities
                    .Select(entity => entity.GetValueFor(date).ToValueSnapshotDto())
                    .ToArray();

                if (values.All(value => value == null))
                {
                    return null;
                }

                return new ValueSnapshotDto(
                    Value: values.Sum(x => x?.Value ?? 0)
                );
            },
            Id: null
        );
    }
}