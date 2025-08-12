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
    
    public async ValueTask SetWalletComponentValue(Guid componentId, DateOnly date, Money value, Guid? physicalAllocationId)
    {
        var entity = dbContext.Find<Component>(componentId)!;
        var newValue = entity.SetValue(date, value, physicalAllocationId ?? entity.DefaultPhysicalAllocationId);

        if (newValue != null)
        {
            dbContext.Add(newValue);
        }

        await dbContext.SaveChangesAsync();
    }
}