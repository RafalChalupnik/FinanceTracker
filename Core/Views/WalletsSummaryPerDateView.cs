using FinanceTracker.Core.Interfaces;
using FinanceTracker.Core.Views.DTOs;
using FinanceTracker.Core.Views.Implementation;

namespace FinanceTracker.Core.Views;

public class WalletsSummaryPerDateView(IWalletsRepository repository)
{
    public EntitiesPerDateViewDto GetWalletsSummaryPerDate(Guid portfolioId) =>
        EntitiesPerDateViewDtoFactory.BuildEntitiesPerDateViewDto(repository
            .GetWallets(portfolioId)
            .ToArray()
        );
}