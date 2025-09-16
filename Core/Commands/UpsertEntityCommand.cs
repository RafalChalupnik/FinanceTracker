using FinanceTracker.Core.Entities;
using FinanceTracker.Core.Interfaces;
using FinanceTracker.Core.Queries.DTOs;

namespace FinanceTracker.Core.Commands;

public class UpsertEntityCommand(FinanceTrackerContext dbContext)
{
    public async ValueTask Upsert<T>(OrderableEntityDto updatedEntity) where T : class, IOrderableEntity, new()
    {
        var alreadyExistingEntity = dbContext.Set<T>()
            .SingleOrDefault(entity => entity.Id == updatedEntity.Key);

        if (alreadyExistingEntity != null)
        {
            alreadyExistingEntity.Name = updatedEntity.Name;
            alreadyExistingEntity.DisplaySequence = updatedEntity.DisplaySequence;
        }
        else
        {
            dbContext.Set<T>().Add(new T
            {
                Name = updatedEntity.Name,
                DisplaySequence = updatedEntity.DisplaySequence
            });
        }
        
        await dbContext.SaveChangesAsync();
    }

    public async ValueTask UpsertWalletComponent(Guid walletId, WalletComponentDataDto updatedComponent)
    {
        var alreadyExistingComponent = dbContext.Components
            .SingleOrDefault(component => component.Id == updatedComponent.Key);
        
        if (alreadyExistingComponent != null)
        {
            alreadyExistingComponent.Name = updatedComponent.Name;
            alreadyExistingComponent.DisplaySequence = updatedComponent.DisplaySequence;
            alreadyExistingComponent.DefaultPhysicalAllocationId = updatedComponent.DefaultPhysicalAllocationId;
        }
        else
        {
            dbContext.Components.Add(new Component
            {
                Name = updatedComponent.Name,
                DisplaySequence = updatedComponent.DisplaySequence,
                WalletId = walletId,
                DefaultPhysicalAllocationId = updatedComponent.DefaultPhysicalAllocationId
            });
        }
        
        await dbContext.SaveChangesAsync();
    }
}