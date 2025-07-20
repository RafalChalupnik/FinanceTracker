using FinanceTracker.Core;
using FinanceTracker.Core.Primitives;
using Microsoft.EntityFrameworkCore;

namespace FinanceTracker.CLI;

public class FinanceTrackerContext : DbContext
{
    public DbSet<Asset> Assets { get; set; }
    
    public DbSet<Component> Components { get; set; }
    
    public DbSet<Debt> Debts { get; set; }
    
    public DbSet<HistoricValue> HistoricValues { get; set; }
    
    public DbSet<Portfolio> Portfolios { get; set; }
    
    public DbSet<Wallet> Wallets { get; set; }

    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
    {
        optionsBuilder.UseSqlite("Data Source=FinanceTracker.db");
    }
}