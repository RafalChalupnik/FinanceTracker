namespace FinanceTracker.Core.Interfaces;

public interface IRepository
{
    IQueryable<Component> GetComponentsForWallet(Guid walletId);
    
    T GetEntityWithValueHistory<T>(Guid id) where T : EntityWithValueHistory, IEntity;

    IQueryable<T> GetEntities<T>() where T : class, IEntity;
    
    IQueryable<T> GetEntitiesWithValueHistory<T>() where T : EntityWithValueHistory;
    
    IQueryable<T> GetOrderableEntities<T>() where T : class, IOrderableEntity;
    
    IQueryable<Wallet> GetWallets(bool includeValueHistory);

    void Add<T>(T entity) where T : class;
    
    ValueTask DeleteAsync<T>(IQueryable<T> entities);

    void Update<T>(T entity) where T : class, IEntity;
    
    ValueTask SaveChangesAsync();
}