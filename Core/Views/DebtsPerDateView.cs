using FinanceTracker.Core.Interfaces;
using FinanceTracker.Core.Views.DTOs;
using FinanceTracker.Core.Views.Implementation;

namespace FinanceTracker.Core.Views;

public class DebtsPerDateView(IRepository repository)
{
    public EntitiesPerDateViewDto GetDebtsPerDate(Guid portfolioId) =>
        EntitiesPerDateViewDtoFactory.BuildEntitiesPerDateViewDto(repository
            .GetEntitiesFor<Debt>(portfolioId)
            .ToArray()
        );
}