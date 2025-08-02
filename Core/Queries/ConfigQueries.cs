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
            Wallets: GetWallets()
        );
    }

    private OrderableEntityDto[] GetOrderableEntities<T>() where T : class, IOrderableEntity =>
        BuildOrderableEntityDtos(
            repository.GetOrderableEntities<T>()
        );

    private WalletDataDto[] GetWallets()
    {
        return repository.GetWallets(includeValueHistory: false)
            .AsEnumerable()
            .Select(wallet => new WalletDataDto(
                    Id: wallet.Id,
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
                    Id: entity.Id, 
                    Name: entity.Name, 
                    DisplaySequence: entity.DisplaySequence
                )
            )
            .OrderBy(x => x.DisplaySequence)
            .ToArray();
    }
}