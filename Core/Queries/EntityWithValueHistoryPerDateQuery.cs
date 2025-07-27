using FinanceTracker.Core.Interfaces;
using FinanceTracker.Core.Queries.DTOs;
using FinanceTracker.Core.Queries.Implementation;

namespace FinanceTracker.Core.Queries;

public class EntityWithValueHistoryPerDateQuery(IRepository repository)
{
    public EntitiesPerDateQueryDto GetAssets() 
        => Execute<Asset>(EntitiesPerDateViewDtoFactory.BaseValueType.Positive);
    
    public EntitiesPerDateQueryDto GetDebts() 
        => Execute<Debt>(EntitiesPerDateViewDtoFactory.BaseValueType.Negative);
    
    public EntitiesPerDateQueryDto GetWalletsSummary() =>
        EntitiesPerDateViewDtoFactory.BuildEntitiesPerDateViewDto(
            entities: repository.GetWallets(),
            EntitiesPerDateViewDtoFactory.BaseValueType.Positive
        );
    
    private EntitiesPerDateQueryDto Execute<T>(EntitiesPerDateViewDtoFactory.BaseValueType valueType)
        where T : EntityWithValueHistory, IOrderableEntity =>
        EntitiesPerDateViewDtoFactory.BuildEntitiesPerDateViewDto(
            entities: repository.GetEntitiesWithValueHistory<T>(),
            valueType
        );
}