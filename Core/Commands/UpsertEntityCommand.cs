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
}