using FinanceTracker.Core.Interfaces;
using FinanceTracker.Core.Views.DTOs;
using FinanceTracker.Core.Views.Implementation;

namespace FinanceTracker.Core.Views;

public class WalletsPerDateView(IRepository repository)
{
    public WalletsPerDateViewDto GetWalletsPerDate(Guid portfolioId)
    {
        var wallets = repository
            .GetEntitiesFor<Wallet>(portfolioId)
            .ToArray();

        return new WalletsPerDateViewDto(
            Wallets: wallets
                .Select(wallet => new WalletDto(
                        Id: wallet.Id,
                        Name: wallet.Name,
                        Data: EntitiesPerDateViewDtoFactory
                            .BuildEntitiesPerDateViewDto(wallet.Components)
                            .Data
                    )
                )
                .ToArray()
        );
    }
}