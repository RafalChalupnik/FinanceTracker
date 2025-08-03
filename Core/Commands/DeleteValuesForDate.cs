using FinanceTracker.Core.Interfaces;

namespace FinanceTracker.Core.Commands;

public class DeleteValuesForDate(IRepository repository)
{
    public async ValueTask DeleteValues<T>(DateOnly date)
        where T : EntityWithValueHistory
    {
        var entitiesToDelete = repository.GetEntitiesWithValueHistory<T>()
            .SelectMany(entity => entity.ValueHistory)
            .Where(entry => entry.Date == date);
        
        await repository.DeleteAsync(entitiesToDelete);
    }
    
    public async ValueTask DeleteWalletValues(Guid walletId, DateOnly date)
    {
        var entitiesToDelete = repository.GetComponentsForWallet(walletId)
            .SelectMany(entity => entity.ValueHistory)
            .Where(entry => entry.Date == date);
        
        await repository.DeleteAsync(entitiesToDelete);
    }
}