using FinanceTracker.Core.Interfaces;
using FinanceTracker.Core.Queries.DTOs;
using FinanceTracker.Core.Queries.Implementation;

namespace FinanceTracker.Core.Queries;

public class PortfolioPerDateQuery(IRepository repository)
{
    private static EntitiesPerDateViewDtoFactory.EntityData MapEntities<T>(
        IReadOnlyCollection<T> entities, 
        string name, 
        EntitiesPerDateViewDtoFactory.BaseValueType valueType
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
                    .Select(entity => entity.GetValueFor(date, valueType))
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

    public EntitiesPerDateQueryDto GetPortfolioPerDate()
    {
        EntitiesPerDateViewDtoFactory.EntityData[] entities =
        [
            MapEntities(repository.GetWallets().ToArray(), "Wallets", EntitiesPerDateViewDtoFactory.BaseValueType.Positive),
            MapEntities(repository.GetEntitiesWithValueHistory<Asset>().ToArray(), "Assets", EntitiesPerDateViewDtoFactory.BaseValueType.Positive),
            MapEntities(repository.GetEntitiesWithValueHistory<Debt>().ToArray(), "Debts", EntitiesPerDateViewDtoFactory.BaseValueType.Negative),
        ];

        return EntitiesPerDateViewDtoFactory.BuildEntitiesPerDateViewDto(entities);
    }
}
