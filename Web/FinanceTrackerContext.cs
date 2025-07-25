using FinanceTracker.Core;
using FinanceTracker.Core.Interfaces;
using FinanceTracker.Core.Primitives;
using Microsoft.EntityFrameworkCore;

namespace FinanceTracker.Web;

public class FinanceTrackerContext(DbContextOptions<FinanceTrackerContext> options) : DbContext(options)
{
    public DbSet<Asset> Assets { get; set; }
    
    public DbSet<Component> Components { get; set; }
    
    public DbSet<Debt> Debts { get; set; }
    
    public DbSet<HistoricValue> HistoricValues { get; set; }
    
    public DbSet<Portfolio> Portfolios { get; set; }
    
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
            });
        
        modelBuilder.Entity<Debt>(
            b =>
            {
                b.HasKey(x => x.Id);
                b.Property(x => x.Name);
                b.Property(x => x.DisplaySequence);
            });
        
        modelBuilder.Entity<Portfolio>(
            b =>
            {
                b.HasKey(x => x.Id);
                b.HasIndex(x => x.Name).IsUnique();
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
        public IQueryable<T> GetEntitiesFor<T>(Guid portfolioId)
        {
            return typeof(T) switch
            {
                { } t when t == typeof(Asset) => context.Portfolios
                    .Where(portfolio => portfolio.Id == portfolioId)
                    .SelectMany(portfolio => portfolio.Assets)
                    .Include(x => x.ValueHistory)
                    .Cast<T>(),
                { } t when t == typeof(Debt) => context.Portfolios
                    .Where(portfolio => portfolio.Id == portfolioId)
                    .SelectMany(portfolio => portfolio.Debts)
                    .Include(x => x.ValueHistory)
                    .Cast<T>(),
                { } t when t == typeof(Component) => context.Portfolios
                    .Where(portfolio => portfolio.Id == portfolioId)
                    .SelectMany(portfolio => portfolio.Wallets)
                    .Include(wallet => wallet.Components)
                    .SelectMany(wallet => wallet.Components)
                    .Include(component => component.ValueHistory)
                    .Cast<T>(),
                { } t when t == typeof(Wallet) => context.Portfolios
                    .Where(portfolio => portfolio.Id == portfolioId)
                    .SelectMany(portfolio => portfolio.Wallets)
                    .Include(wallet => wallet.Components)
                    .ThenInclude(component => component.ValueHistory)
                    .Cast<T>(),
                _ => throw new NotImplementedException()
            };
        }

        public void Add<T>(T entity) where T : class
            => context.Set<T>().Add(entity);

        public async ValueTask DeleteAsync<T>(IQueryable<T> entities)
            => await entities.ExecuteDeleteAsync();

        public async ValueTask SaveChangesAsync()
            => await context.SaveChangesAsync();
    }
}