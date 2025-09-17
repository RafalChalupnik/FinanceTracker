using Microsoft.EntityFrameworkCore;

namespace FinanceTracker.Core.Commands;

public class DeleteValuesForDate(FinanceTrackerContext dbContext)
{
    public async ValueTask DeleteGroupValues(Guid groupId, DateOnly date)
    {
        await dbContext.Components
            .Where(component => component.GroupId == groupId)
            .SelectMany(entity => entity.ValueHistory)
            .Where(entry => entry.Date == date)
            .ExecuteDeleteAsync();
    }
    
    public async ValueTask DeleteValues<T>(DateOnly date)
        where T : EntityWithValueHistory
    {
        await dbContext.Set<T>()
            .SelectMany(entity => entity.ValueHistory)
            .Where(entry => entry.Date == date)
            .ExecuteDeleteAsync();
    }
    
    public async ValueTask DeleteWalletValues(Guid walletId, DateOnly date)
    {
        await dbContext.Components
            .Where(component => component.WalletId == walletId)
            .SelectMany(entity => entity.ValueHistory)
            .Where(entry => entry.Date == date)
            .ExecuteDeleteAsync();
    }
}