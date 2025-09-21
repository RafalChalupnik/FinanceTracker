using Microsoft.EntityFrameworkCore;

namespace FinanceTracker.Core.Commands;

public class SetTargetCommand(FinanceTrackerContext dbContext)
{
    public async ValueTask SetTarget(Guid groupId, DateOnly date, decimal value)
    {
        var group = dbContext.Groups
            .Include(x => x.Targets)
            .First(group => group.Id == groupId);
        
        var newValue = group.SetTarget(date, value);

        if (newValue != null)
        {
            dbContext.WalletTargets.Add(newValue);
        }

        await dbContext.SaveChangesAsync();
    }
}