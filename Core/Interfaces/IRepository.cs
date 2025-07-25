namespace FinanceTracker.Core.Interfaces;

public interface IRepository
{
    IQueryable<T> GetEntitiesWithValueHistoryFor<T>(Guid portfolioId) 
        where T : EntityWithValueHistory, IEntityInPortfolio;
    
    IQueryable<Wallet> GetWalletsFor(Guid portfolioId);

    IQueryable<Component> GetComponentsForWallet(Guid walletId);
    
    T GetEntityWithValueHistory<T>(Guid id) where T : EntityWithValueHistory, IEntity;

    void Add<T>(T entity) where T : class;

    ValueTask DeleteAsync<T>(IQueryable<T> entities);
    
    ValueTask SaveChangesAsync();
}