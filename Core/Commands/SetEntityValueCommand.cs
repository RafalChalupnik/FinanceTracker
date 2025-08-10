using FinanceTracker.Core.Interfaces;
using FinanceTracker.Core.Primitives;

namespace FinanceTracker.Core.Commands;

public class SetEntityValueCommand(FinanceTrackerContext dbContext)
{
    public async ValueTask SetEntityValue<T>(Guid entityId, DateOnly date, Money value)
        where T : EntityWithValueHistory, INamedEntity
    {
        var entity = dbContext.Find<T>(entityId)!;
        var newValue = entity.SetValue(date, value);

        if (newValue != null)
        {
            dbContext.Add(newValue);
        }

        await dbContext.SaveChangesAsync();
    }
}