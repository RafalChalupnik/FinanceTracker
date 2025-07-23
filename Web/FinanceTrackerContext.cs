using FinanceTracker.Core;
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

    public static Portfolio BuildTestPortfolio()
    {
        var date = new DateOnly(2020, 1, 1);
        
        var emergencyFund = new Wallet("Emergency Fund", displaySequence: 1);
        AddComponents(emergencyFund, date, ["Savings Account", "Cash - PLN", "Cash - CAD", "Bonds", "Bonds - Retirement Account"]);
        
        var longTermWallet = new Wallet("Long-term Wallet", displaySequence: 2);
        AddComponents(longTermWallet, date, ["Bonds", "Stocks"]);

        var home = new Asset("Home", displaySequence: 1);
        home.Evaluate(date, new Money(0, "PLN", 0));
        
        var car = new Asset("Car", displaySequence: 2);
        car.Evaluate(date, new Money(0, "PLN", 0));
        
        var mortgage = new Debt("Mortgage", displaySequence: 1);
        mortgage.Evaluate(date, new Money(0, "PLN", 0));
        
        var dryer = new Debt("Dryer", displaySequence: 2);
        dryer.Evaluate(date, new Money(0, "PLN", 0));
        
        var portfolio = new Portfolio(name: "My portfolio");
        portfolio.Add(emergencyFund);
        portfolio.Add(longTermWallet);
        portfolio.Add(home);
        portfolio.Add(car);
        portfolio.Add(mortgage);
        portfolio.Add(dryer);

        return portfolio;
    }

    private static void AddComponents(Wallet wallet, DateOnly date, IEnumerable<string> names)
    {
        foreach (var (name, displaySequence) in names.Zip(Enumerable.Range(1, 5)))
        {
            var component = new Component(name, displaySequence);
            component.Evaluate(date, new Money(0, "PLN", 0));
            wallet.Add(component);
        }
    }
}