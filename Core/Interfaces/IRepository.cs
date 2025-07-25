namespace FinanceTracker.Core.Interfaces;

public interface IRepository
{
    IQueryable<T> GetEntitiesFor<T>(Guid portfolioId);

    void Add<T>(T entity) where T : class;

    ValueTask DeleteAsync<T>(IQueryable<T> entities);
    
    ValueTask SaveChangesAsync();
}