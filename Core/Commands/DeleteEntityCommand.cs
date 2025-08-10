using FinanceTracker.Core.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace FinanceTracker.Core.Commands;

public class DeleteEntityCommand(FinanceTrackerContext dbContext)
{
    public async ValueTask Delete<T>(Guid id) where T : class, INamedEntity
    {
        await dbContext.Set<T>()
            .Where(entity => entity.Id == id)
            .ExecuteDeleteAsync();
    }
}