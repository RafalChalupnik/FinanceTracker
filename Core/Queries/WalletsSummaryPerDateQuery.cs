using FinanceTracker.Core.Interfaces;
using FinanceTracker.Core.Queries.DTOs;
using FinanceTracker.Core.Queries.Implementation;

namespace FinanceTracker.Core.Queries;

public class WalletsSummaryPerDateQuery(IRepository repository)
{
    public EntitiesPerDateQueryDto GetWalletsSummaryPerDate(Guid portfolioId) =>
        EntitiesPerDateViewDtoFactory.BuildEntitiesPerDateViewDto(repository
            .GetEntitiesFor<Wallet>(portfolioId)
            .ToArray()
        );
}