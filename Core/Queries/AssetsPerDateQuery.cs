using FinanceTracker.Core.Interfaces;
using FinanceTracker.Core.Queries.DTOs;
using FinanceTracker.Core.Queries.Implementation;

namespace FinanceTracker.Core.Queries;

public class AssetsPerDateQuery(IRepository repository)
{
    public EntitiesPerDateQueryDto GetAssetsPerDate(Guid portfolioId) =>
        EntitiesPerDateViewDtoFactory.BuildEntitiesPerDateViewDto(repository
            .GetEntitiesFor<Asset>(portfolioId)
            .ToArray()
        );
}