using FinanceTracker.Core.Entities;
using Microsoft.EntityFrameworkCore;

namespace FinanceTracker.Core;

public class FinanceTrackerContext(DbContextOptions<FinanceTrackerContext> options) : DbContext(options)
{
    public DbSet<GroupType> GroupTypes { get; set; }
    
    public DbSet<Asset> Assets { get; set; }
    
    public DbSet<Component> Components { get; set; }
    
    public DbSet<Debt> Debts { get; set; }
    
    public DbSet<HistoricValue> HistoricValues { get; set; }
    
    public DbSet<InflationHistoricValue> InflationValues { get; set; }
    
    public DbSet<PhysicalAllocation> PhysicalAllocations { get; set; }
    
    public DbSet<Wallet> Wallets { get; set; }
    
    public DbSet<WalletTarget> WalletTargets { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<GroupType>(b =>
        {
            b.HasKey(x => x.Id);
            b.HasIndex(x => x.Name).IsUnique();
            b.Property(x => x.DisplaySequence);
        });
        
        modelBuilder.Entity<Asset>(
            b =>
            {
                b.HasKey(x => x.Id);
                b.HasIndex(x => x.Name).IsUnique();
                b.Property(x => x.DisplaySequence);
                b.HasMany(x => x.ValueHistory)
                    .WithOne()
                    .HasForeignKey(x => x.AssetId)
                    .OnDelete(DeleteBehavior.Cascade);
            });
        
        modelBuilder.Entity<Component>(
            b =>
            {
                b.HasKey(x => x.Id);
                b.HasIndex(x => new {x.Id, x.Name}).IsUnique();
                b.Property(x => x.DisplaySequence);
                
                b.HasMany(x => x.ValueHistory)
                    .WithOne(x => x.Component)
                    .HasForeignKey(x => x.ComponentId)
                    .OnDelete(DeleteBehavior.Cascade);

                b.HasOne<PhysicalAllocation>()
                    .WithMany()
                    .HasForeignKey(x => x.DefaultPhysicalAllocationId)
                    .OnDelete(DeleteBehavior.SetNull);
            });
        
        modelBuilder.Entity<Debt>(
            b =>
            {
                b.HasKey(x => x.Id);
                b.HasIndex(x => x.Name).IsUnique();
                b.Property(x => x.DisplaySequence);
                b.HasMany(x => x.ValueHistory)
                    .WithOne()
                    .HasForeignKey(x => x.DebtId)
                    .OnDelete(DeleteBehavior.Cascade);
            });
        
        modelBuilder.Entity<HistoricValue>(b =>
        {
            b.HasKey(x => x.Id);
            b.Property(x => x.Date);
            b.ComplexProperty(x => x.Value);

            b.HasOne<PhysicalAllocation>()
                .WithMany(x => x.ValueHistory)
                .HasForeignKey(x => x.PhysicalAllocationId);
        });

        modelBuilder.Entity<InflationHistoricValue>(b =>
            {
                b.HasKey(x => x.Id);
                b.HasIndex(x => new {x.Year, x.Month}).IsUnique();
            }
            );

        modelBuilder.Entity<PhysicalAllocation>(b =>
        {
            b.HasKey(x => x.Id);
            b.HasIndex(x => x.Name).IsUnique();
            b.Property(x => x.DisplaySequence);
            b.HasMany(x => x.ValueHistory)
                .WithOne()
                .OnDelete(DeleteBehavior.SetNull);
        });
        
        modelBuilder.Entity<Wallet>(
            b =>
            {
                b.HasKey(x => x.Id);
                b.HasIndex(x => x.Name).IsUnique();
                b.Property(x => x.DisplaySequence);
                b.HasMany(x => x.Components)
                    .WithOne(x => x.Wallet)
                    .HasForeignKey(x => x.WalletId)
                    .IsRequired()
                    .OnDelete(DeleteBehavior.Cascade);
                b.HasMany(x => x.Targets)
                    .WithOne()
                    .HasForeignKey(x => x.WalletId)
                    .OnDelete(DeleteBehavior.Cascade);
            });
    }
}