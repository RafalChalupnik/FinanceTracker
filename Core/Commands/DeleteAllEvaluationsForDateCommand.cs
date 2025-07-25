using FinanceTracker.Core.Interfaces;

namespace FinanceTracker.Core.Commands;

public class DeleteAllEvaluationsForDateCommand(IRepository repository)
{
    public async ValueTask DeleteAllEvaluationsForDate<T>(Guid portfolioId, DateOnly date)
        where T : EntityWithValueHistory
    {
        var entitiesToDelete = repository.GetEntitiesFor<T>(portfolioId)
            .SelectMany(entity => entity.ValueHistory)
            .Where(entry => entry.Date == date);
        
        await repository.DeleteAsync(entitiesToDelete);
    }
}