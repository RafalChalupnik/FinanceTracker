using FinanceTracker.Core.Interfaces;
using FinanceTracker.Core.Queries.DTOs;
using FinanceTracker.Core.Queries.Implementation;

namespace FinanceTracker.Core.Queries;

public class WalletsPerDateQuery(IRepository repository)
{
    public WalletsPerDateQueryDto GetWalletsPerDate(Guid portfolioId)
    {
        var wallets = repository
            .GetEntitiesFor<Wallet>(portfolioId)
            .ToArray();

        return new WalletsPerDateQueryDto(
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