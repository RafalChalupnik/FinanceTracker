using FinanceTracker.Core.Interfaces;
using FinanceTracker.Core.Views.DTOs;
using FinanceTracker.Core.Views.Implementation;

namespace FinanceTracker.Core.Views;

public class AssetsPerDateView(IRepository repository)
{
    public EntitiesPerDateViewDto GetAssetsPerDate(Guid portfolioId) =>
        EntitiesPerDateViewDtoFactory.BuildEntitiesPerDateViewDto(repository
            .GetEntitiesFor<Asset>(portfolioId)
            .ToArray()
        );
}