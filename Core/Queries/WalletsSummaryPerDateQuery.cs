using FinanceTracker.Core.Interfaces;
using FinanceTracker.Core.Queries.DTOs;
using FinanceTracker.Core.Queries.Implementation;

namespace FinanceTracker.Core.Queries;

public class WalletsSummaryPerDateQuery(IRepository repository)
{
    public EntitiesPerDateQueryDto GetWalletsSummaryPerDate() =>
        EntitiesPerDateViewDtoFactory.BuildEntitiesPerDateViewDto(
            repository
                .GetWallets()
                .OrderBy(entity => entity.DisplaySequence)
                .ToArray(),
            EntitiesPerDateViewDtoFactory.BaseValueType.Positive
        );
}