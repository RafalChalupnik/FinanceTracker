using FinanceTracker.Core.Interfaces;
using FinanceTracker.Core.Primitives;

namespace FinanceTracker.Core.Commands;

public class EvaluateEntityCommand(IRepository repository)
{
    public async ValueTask Evaluate<T>(Guid entityId, DateOnly date, Money value)
        where T : EntityWithValueHistory, IEntity
    {
        var entity = repository.GetEntityWithValueHistory<T>(entityId);
        var newValue = entity.Evaluate(date, value);

        if (newValue != null)
        {
            repository.Add(newValue);
        }

        await repository.SaveChangesAsync();
    }
}