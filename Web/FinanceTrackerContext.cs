using FinanceTracker.Core;
using FinanceTracker.Core.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace FinanceTracker.Web;

public class FinanceTrackerContext(DbContextOptions<FinanceTrackerContext> options) : DbContext(options)
{
    public DbSet<Asset> Assets { get; set; }
    
    public DbSet<Component> Components { get; set; }
    
    public DbSet<Debt> Debts { get; set; }
    
    public DbSet<HistoricValue> HistoricValues { get; set; }
    
    public DbSet<Wallet> Wallets { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder) 
    { 
        modelBuilder.Entity<Asset>(
            b =>
            {
                b.HasKey(x => x.Id);
                b.Property(x => x.Name);
                b.Property(x => x.DisplaySequence);
                b.HasMany(x => x.ValueHistory);
            });
        
        modelBuilder.Entity<Component>(
            b =>
            {
                b.HasKey(x => x.Id);
                b.Property(x => x.Name);
                b.Property(x => x.DisplaySequence);
                b.HasMany(x => x.ValueHistory);
            });
        
        modelBuilder.Entity<Debt>(
            b =>
            {
                b.HasKey(x => x.Id);
                b.Property(x => x.Name);
                b.Property(x => x.DisplaySequence);
                b.HasMany(x => x.ValueHistory);
            });
        
        modelBuilder.Entity<Wallet>(
            b =>
            {
                b.HasKey(x => x.Id);
                b.Property(x => x.Name);
                b.Property(x => x.DisplaySequence);
            });
    }
    
    public class Repository(FinanceTrackerContext context) : IRepository
    {
        public IQueryable<T> GetEntitiesWithValueHistory<T>() where T : EntityWithValueHistory
        {
            return context.Set<T>()
                .Include(x => x.ValueHistory);
        }

        public IQueryable<Wallet> GetWallets()
        {
            return context.Wallets
                .Include(wallet => wallet.Components)
                .ThenInclude(component => component.ValueHistory);
        }

        public IQueryable<Component> GetComponentsForWallet(Guid walletId)
        {
            return context.Wallets
                .Where(wallet => wallet.Id == walletId)
                .Include(wallet => wallet.Components)
                .SelectMany(wallet => wallet.Components)
                .Include(component => component.ValueHistory);
        }

        public T GetEntityWithValueHistory<T>(Guid id) where T : EntityWithValueHistory, IEntity
        {
            return context.Set<T>()
                .Include(x => x.ValueHistory)
                .Single(entity => entity.Id == id);
        }

        public void Add<T>(T entity) where T : class
            => context.Set<T>().Add(entity);

        public async ValueTask DeleteAsync<T>(IQueryable<T> entities)
            => await entities.ExecuteDeleteAsync();

        public async ValueTask SaveChangesAsync()
            => await context.SaveChangesAsync();
    }
}