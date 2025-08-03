using FinanceTracker.Core.Interfaces;
using FinanceTracker.Core.Queries.DTOs;

namespace FinanceTracker.Core.Commands;

public class UpsertEntityCommand(IRepository repository)
{
    public async ValueTask Upsert<T>(OrderableEntityDto updatedEntity) where T : class, IOrderableEntity, new()
    {
        var alreadyExistingEntity = repository.GetOrderableEntities<T>()
            .SingleOrDefault(entity => entity.Id == updatedEntity.Id);

        if (alreadyExistingEntity != null)
        {
            alreadyExistingEntity.Name = updatedEntity.Name;
            alreadyExistingEntity.DisplaySequence = updatedEntity.DisplaySequence;
        }
        else
        {
            repository.Add(new T
            {
                Name = updatedEntity.Name,
                DisplaySequence = updatedEntity.DisplaySequence
            });
        }
        
        await repository.SaveChangesAsync();
    }

    public async ValueTask CreateWallet(OrderableEntityDto walletData)
    {
        var wallet = new Wallet(
            name: walletData.Name,
            displaySequence: walletData.DisplaySequence
        );

        repository.Add(wallet);
        await repository.SaveChangesAsync();
    }

    public async ValueTask UpsertWalletComponent(Guid walletId, OrderableEntityDto updatedComponent)
    {
        var alreadyExistingComponent = repository.GetOrderableEntities<Component>()
            .SingleOrDefault(component => component.Id == updatedComponent.Id);
        
        if (alreadyExistingComponent != null)
        {
            alreadyExistingComponent.Name = updatedComponent.Name;
            alreadyExistingComponent.DisplaySequence = updatedComponent.DisplaySequence;
        }
        else
        {
            repository.Add(new Component
            {
                Name = updatedComponent.Name,
                DisplaySequence = updatedComponent.DisplaySequence,
                WalletId = walletId
            });
        }
        
        await repository.SaveChangesAsync();
    }
}