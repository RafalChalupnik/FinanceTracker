using FinanceTracker.Core.Interfaces;
using FinanceTracker.Core.Queries.DTOs;

namespace FinanceTracker.Core.Queries;

public class ConfigQueries(IRepository repository)
{
    public ConfigurationDto GetConfiguration()
    {
        return new ConfigurationDto(
            Assets: GetOrderableEntities<Asset>(),
            Debts: GetOrderableEntities<Debt>(),
            Wallets: GetWalletsWithComponents()
        );
    }

    public OrderableEntityDto[] GetWallets()
        => GetOrderableEntities<Wallet>();

    private OrderableEntityDto[] GetOrderableEntities<T>() where T : class, IOrderableEntity =>
        BuildOrderableEntityDtos(
            repository.GetOrderableEntities<T>()
        );

    private WalletDataDto[] GetWalletsWithComponents()
    {
        return repository.GetWallets(includeValueHistory: false, includeTargets: false)
            .AsEnumerable()
            .Select(wallet => new WalletDataDto(
                    Key: wallet.Id,
                    Name: wallet.Name,
                    DisplaySequence: wallet.DisplaySequence,
                    Components: BuildOrderableEntityDtos(wallet.Components)
                )
            )
            .OrderBy(x => x.DisplaySequence)
            .ToArray();
    }

    private static OrderableEntityDto[] BuildOrderableEntityDtos(
        IEnumerable<IOrderableEntity> entities)
    {
        return entities
            .Select(entity => new OrderableEntityDto(
                    Key: entity.Id, 
                    Name: entity.Name, 
                    DisplaySequence: entity.DisplaySequence
                )
            )
            .OrderBy(x => x.DisplaySequence)
            .ToArray();
    }
}