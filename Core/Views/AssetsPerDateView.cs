using FinanceTracker.Core.Interfaces;
using FinanceTracker.Core.Views.DTOs;
using FinanceTracker.Core.Views.Implementation;

namespace FinanceTracker.Core.Views;

public class AssetsPerDateView(IAssetsRepository repository)
{
    public EntitiesPerDateViewDto GetAssetsPerDate(Guid portfolioId) =>
        EntitiesPerDateViewDtoFactory.BuildEntitiesPerDateViewDto(repository
            .GetAssets(portfolioId)
            .ToArray()
        );
}