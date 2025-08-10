using FinanceTracker.Core.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace FinanceTracker.Core;

public class FinanceTrackerContext(DbContextOptions<FinanceTrackerContext> options) : DbContext(options)
{
    public DbSet<Asset> Assets { get; set; }
    
    public DbSet<Component> Components { get; set; }
    
    public DbSet<Debt> Debts { get; set; }
    
    public DbSet<HistoricValue> HistoricValues { get; set; }
    
    public DbSet<InflationHistoricValue> InflationValues { get; set; }
    
    public DbSet<Wallet> Wallets { get; set; }
    
    public DbSet<WalletTarget> WalletTargets { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder) 
    { 
        modelBuilder.Entity<Asset>(
            b =>
            {
                b.HasKey(x => x.Id);
                b.HasIndex(x => x.Name).IsUnique();
                b.Property(x => x.DisplaySequence);
                b.HasMany(x => x.ValueHistory)
                    .WithOne()
                    .OnDelete(DeleteBehavior.Cascade);
            });
        
        modelBuilder.Entity<Component>(
            b =>
            {
                b.HasKey(x => x.Id);
                b.HasIndex(x => new {x.Id, x.Name}).IsUnique();
                b.Property(x => x.DisplaySequence);
                b.HasMany(x => x.ValueHistory)
                    .WithOne()
                    .OnDelete(DeleteBehavior.Cascade);
            });
        
        modelBuilder.Entity<Debt>(
            b =>
            {
                b.HasKey(x => x.Id);
                b.HasIndex(x => x.Name).IsUnique();
                b.Property(x => x.DisplaySequence);
                b.HasMany(x => x.ValueHistory)
                    .WithOne()
                    .OnDelete(DeleteBehavior.Cascade);
            });

        modelBuilder.Entity<InflationHistoricValue>(b =>
            {
                b.HasKey(x => x.Id);
                b.HasIndex(x => new {x.Year, x.Month}).IsUnique();
            }
            );
        
        modelBuilder.Entity<Wallet>(
            b =>
            {
                b.HasKey(x => x.Id);
                b.HasIndex(x => x.Name).IsUnique();
                b.Property(x => x.DisplaySequence);
                b.HasMany(x => x.Components)
                    .WithOne()
                    .HasForeignKey(x => x.WalletId)
                    .IsRequired()
                    .OnDelete(DeleteBehavior.Cascade);
                b.HasMany(x => x.Targets)
                    .WithOne()
                    .OnDelete(DeleteBehavior.Cascade);
            });
    }
    
    public class Repository(FinanceTrackerContext context) : IRepository
    {
        public IQueryable<Component> GetComponentsForWallet(Guid walletId)
        {
            return context.Wallets
                .Where(wallet => wallet.Id == walletId)
                .Include(wallet => wallet.Components)
                .SelectMany(wallet => wallet.Components)
                .Include(component => component.ValueHistory);
        }

        public T GetEntityWithValueHistory<T>(Guid id) where T : EntityWithValueHistory, INamedEntity
        {
            return context.Set<T>()
                .Include(x => x.ValueHistory)
                .Single(entity => entity.Id == id);
        }

        public IQueryable<T> GetEntities<T>() where T : class, IEntity
            => context.Set<T>();

        public IQueryable<T> GetEntitiesWithValueHistory<T>() where T : EntityWithValueHistory
        {
            return context.Set<T>()
                .Include(x => x.ValueHistory);
        }

        public IQueryable<T> GetOrderableEntities<T>() where T : class, IOrderableEntity
            => context.Set<T>();

        public IQueryable<Wallet> GetWallets(bool includeValueHistory, bool includeTargets)
        {
            IQueryable<Wallet> query = context.Wallets;
                
            query = includeTargets 
                ? query.Include(wallet => wallet.Targets)
                : query;
                
            query = includeValueHistory
                ? query.Include(wallet => wallet.Components).ThenInclude(component => component.ValueHistory)
                : query.Include(wallet => wallet.Components);

            return query;
        }

        public void Add<T>(T entity) where T : class
            => context.Set<T>().Add(entity);
        
        public async ValueTask DeleteAsync<T>(IQueryable<T> entities)
            => await entities.ExecuteDeleteAsync();
        
        public void Update<T>(T entity) where T : class, INamedEntity 
            => context.Set<T>().Update(entity);

        public async ValueTask SaveChangesAsync()
            => await context.SaveChangesAsync();
    }
}