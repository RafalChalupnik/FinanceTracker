using FinanceTracker.Core.Entities;
using Microsoft.EntityFrameworkCore;

namespace FinanceTracker.Core;

public class FinanceTrackerContext(DbContextOptions<FinanceTrackerContext> options) : DbContext(options)
{
    public DbSet<GroupType> GroupTypes { get; set; }
    
    public DbSet<Group> Groups { get; set; }
    
    public DbSet<Component> Components { get; set; }
    
    public DbSet<InflationHistoricValue> InflationValues { get; set; }
    
    public DbSet<LedgerEntry> Ledger { get; set; }
    
    public DbSet<PhysicalAllocation> PhysicalAllocations { get; set; }
    
    public DbSet<HistoricTarget> HistoricTargets { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<GroupType>(b =>
        {
            b.HasKey(x => x.Id);
            b.HasIndex(x => x.Name).IsUnique();
            b.Property(x => x.DisplaySequence);
        });
        
        modelBuilder.Entity<Group>(b =>
        {
            b.HasKey(x => x.Id);
            b.HasIndex(x => x.Name).IsUnique();
            b.Property(x => x.DisplaySequence);

            b.HasOne<GroupType>(x => x.GroupType)
                .WithMany(x => x.Groups)
                .HasForeignKey(x => x.GroupTypeId);

            b.HasMany<Component>(x => x.Components)
                .WithOne(x => x.Group)
                .HasForeignKey(x => x.GroupId)
                .IsRequired()
                .OnDelete(DeleteBehavior.Cascade);
            
            b.HasMany<HistoricTarget>(x => x.Targets)
                .WithOne()
                .HasForeignKey(x => x.GroupId)
                .OnDelete(DeleteBehavior.Cascade);
        });
        
        modelBuilder.Entity<Component>(
            b =>
            {
                b.HasKey(x => x.Id);
                b.HasIndex(x => new {x.Id, x.Name}).IsUnique();
                b.Property(x => x.DisplaySequence);
                
                b.HasOne<PhysicalAllocation>()
                    .WithMany()
                    .HasForeignKey(x => x.DefaultPhysicalAllocationId)
                    .OnDelete(DeleteBehavior.SetNull);
            });
        
        modelBuilder.Entity<InflationHistoricValue>(b =>
            {
                b.HasKey(x => x.Id);
                b.HasIndex(x => new {x.Year, x.Month}).IsUnique();
            }
            );

        modelBuilder.Entity<LedgerEntry>(b =>
        {
            b.HasKey(x => x.Id);
            b.Property(x => x.Date);
            b.Property(x => x.TransactionId);
            b.ComplexProperty(x => x.Value);

            b.HasOne(x => x.Component)
                .WithMany(x => x.ValueHistory)
                .HasForeignKey(x => x.ComponentId)
                .IsRequired()
                .OnDelete(DeleteBehavior.Cascade);

            b.HasOne<PhysicalAllocation>()
                .WithMany(x => x.ValueHistory)
                .HasForeignKey(x => x.PhysicalAllocationId)
                .OnDelete(DeleteBehavior.SetNull);
        });

        modelBuilder.Entity<PhysicalAllocation>(b =>
        {
            b.HasKey(x => x.Id);
            b.HasIndex(x => x.Name).IsUnique();
            b.Property(x => x.DisplaySequence);
        });
    }
}