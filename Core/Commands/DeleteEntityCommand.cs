using FinanceTracker.Core.Interfaces;

namespace FinanceTracker.Core.Commands;

public class DeleteEntityCommand(IRepository repository)
{
    public async ValueTask Delete<T>(Guid id) where T : class, INamedEntity
    {
        await repository.DeleteAsync(
            repository.GetEntities<T>()
                .Where(entity => entity.Id == id)
        );
    }
}