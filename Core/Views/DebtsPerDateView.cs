using FinanceTracker.Core.Interfaces;
using FinanceTracker.Core.Views.DTOs;
using FinanceTracker.Core.Views.Implementation;

namespace FinanceTracker.Core.Views;

public class DebtsPerDateView(IDebtsRepository repository)
{
    public EntitiesPerDateViewDto GetDebtsPerDate(Guid portfolioId) =>
        EntitiesPerDateViewDtoFactory.BuildEntitiesPerDateViewDto(repository
            .GetDebts(portfolioId)
            .ToArray()
        );
}