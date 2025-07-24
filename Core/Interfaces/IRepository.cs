namespace FinanceTracker.Core.Interfaces;

public interface IRepository
{
    IQueryable<T> GetEntitiesFor<T>(Guid portfolioId);
}