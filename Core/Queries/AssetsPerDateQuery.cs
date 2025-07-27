using FinanceTracker.Core.Interfaces;
using FinanceTracker.Core.Queries.DTOs;
using FinanceTracker.Core.Queries.Implementation;

namespace FinanceTracker.Core.Queries;

public class AssetsPerDateQuery(IRepository repository)
{
    public EntitiesPerDateQueryDto GetAssetsPerDate() =>
        EntitiesPerDateViewDtoFactory.BuildEntitiesPerDateViewDto(repository
            .GetEntitiesWithValueHistory<Asset>()
            .ToArray()
        );
}