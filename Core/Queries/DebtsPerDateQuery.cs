using FinanceTracker.Core.Interfaces;
using FinanceTracker.Core.Queries.DTOs;
using FinanceTracker.Core.Queries.Implementation;

namespace FinanceTracker.Core.Queries;

public class DebtsPerDateQuery(IRepository repository)
{
    public EntitiesPerDateQueryDto GetDebtsPerDate() =>
        EntitiesPerDateViewDtoFactory.BuildEntitiesPerDateViewDto(repository
            .GetEntitiesWithValueHistory<Debt>()
            .ToArray()
        );
}