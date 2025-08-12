using FinanceTracker.Core.Interfaces;
using FinanceTracker.Core.Primitives;
using Microsoft.EntityFrameworkCore;

namespace FinanceTracker.Core.Commands;

public class SetEntityValueCommand(FinanceTrackerContext dbContext)
{
    public async ValueTask SetEntityValue<T>(Guid entityId, DateOnly date, Money value)
        where T : EntityWithValueHistory, INamedEntity
    {
        var entity = dbContext.Set<T>()
            .Include(x => x.ValueHistory)
            .First(x => x.Id == entityId);
        
        var newValue = entity.SetValue(date, value);

        if (newValue != null)
        {
            dbContext.Add(newValue);
        }

        await dbContext.SaveChangesAsync();
    }
    
    public async ValueTask SetWalletComponentValue(Guid componentId, DateOnly date, Money value, Guid? physicalAllocationId)
    {
        var component = dbContext.Set<Component>()
            .Include(x => x.ValueHistory)
            .First(x => x.Id == componentId);
        
        var newValue = component.SetValue(date, value, physicalAllocationId ?? component.DefaultPhysicalAllocationId);

        if (newValue != null)
        {
            dbContext.Add(newValue);
        }

        await dbContext.SaveChangesAsync();
    }
}