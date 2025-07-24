using FinanceTracker.Core.Interfaces;
using FinanceTracker.Core.Views.DTOs;
using FinanceTracker.Core.Views.Implementation;

namespace FinanceTracker.Core.Views;

public class WalletsSummaryPerDateView(IRepository repository)
{
    public EntitiesPerDateViewDto GetWalletsSummaryPerDate(Guid portfolioId) =>
        EntitiesPerDateViewDtoFactory.BuildEntitiesPerDateViewDto(repository
            .GetEntitiesFor<Wallet>(portfolioId)
            .ToArray()
        );
}