using FinanceTracker.Core.Interfaces;

namespace FinanceTracker.Core.Commands;

public class DeleteAllEvaluationsForDateCommand(IRepository repository)
{
    public async ValueTask DeleteAllEvaluationsForDate<T>(DateOnly date)
        where T : EntityWithValueHistory
    {
        var entitiesToDelete = repository.GetEntitiesWithValueHistory<T>()
            .SelectMany(entity => entity.ValueHistory)
            .Where(entry => entry.Date == date);
        
        await repository.DeleteAsync(entitiesToDelete);
    }
    
    public async ValueTask DeleteAllWalletComponentEvaluationsForDate(Guid walletId, DateOnly date)
    {
        var entitiesToDelete = repository.GetComponentsForWallet(walletId)
            .SelectMany(entity => entity.ValueHistory)
            .Where(entry => entry.Date == date);
        
        await repository.DeleteAsync(entitiesToDelete);
    }
}