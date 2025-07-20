// See https://aka.ms/new-console-template for more information

using FinanceTracker.CLI;
using FinanceTracker.Core;
using FinanceTracker.Core.Primitives;
using Microsoft.EntityFrameworkCore;

var portfolio = new Portfolio
{
    Id = Guid.NewGuid(),
    Name = "My portfolio",
    Wallets = [
        new Wallet
        {
            Id = Guid.NewGuid(),
            Name = "Emergency Fund",
            Components = [
                new Component
                {
                    Id = Guid.NewGuid(),
                    Name = "Savings Account",
                    ValueHistory = [
                        new HistoricValue
                        {
                            Id = Guid.NewGuid(),
                            Date = new DateOnly(2025, 04, 01), 
                            Value = new Money(20_000, "PLN", 20_000)
                        }
                    ]
                },
                new Component
                {
                    Id = Guid.NewGuid(),
                    Name = "Cash - PLN",
                    ValueHistory = [
                        new HistoricValue
                        {
                            Id = Guid.NewGuid(),
                            Date = new DateOnly(2025, 04, 01), 
                            Value = new Money(5_000, "PLN", 5_000)
                        }
                    ]
                },
                new Component
                {
                    Id = Guid.NewGuid(),
                    Name = "Cash - CAD",
                    ValueHistory = [
                        new HistoricValue
                        {
                            Id = Guid.NewGuid(),
                            Date = new DateOnly(2025, 04, 01), 
                            Value = new Money(1_800, "CAD", 4_788.31m)
                        }
                    ]
                },
                new Component
                {
                    Id = Guid.NewGuid(),
                    Name = "Bonds",
                    ValueHistory = [
                        new HistoricValue
                        {
                            Id = Guid.NewGuid(),
                            Date = new DateOnly(2025, 04, 01), 
                            Value = new Money(20_000, "PLN", 20_000)
                        }
                    ]
                },
                new Component
                {
                    Id = Guid.NewGuid(),
                    Name = "Bonds - Retirement Account",
                    ValueHistory = [
                        new HistoricValue
                        {
                            Id = Guid.NewGuid(),
                            Date = new DateOnly(2025, 04, 01), 
                            Value = new Money(10_000, "PLN", 10_000)
                        }
                    ]
                }
            ],
            Target = 60_000
        },
        new Wallet
        {
            Id = Guid.NewGuid(),
            Name = "Long-term Wallet",
            Components = [
                new Component
                {
                    Id = Guid.NewGuid(),
                    Name = "Bonds",
                    ValueHistory = [
                        new HistoricValue
                        {
                            Id = Guid.NewGuid(),
                            Date = new DateOnly(2025, 04, 01), 
                            Value = new Money(15_000, "PLN", 15_000)
                        }
                    ]
                },
                new Component
                {
                    Id = Guid.NewGuid(),
                    Name = "Stocks",
                    ValueHistory = [
                        new HistoricValue
                        {
                            Id = Guid.NewGuid(),
                            Date = new DateOnly(2025, 04, 01), 
                            Value = new Money(25_000, "PLN", 25_000)
                        }
                    ]
                }
            ]
        }
    ],
    Assets = [
        new Asset
        {
            Id = Guid.NewGuid(),
            Name = "Home",
            ValueHistory = [
                new HistoricValue
                {
                    Id = Guid.NewGuid(),
                    Date = new DateOnly(2025, 04, 01), 
                    Value = new Money(500_000, "PLN", 500_000)
                },
                new HistoricValue
                {
                    Id = Guid.NewGuid(),
                    Date = new DateOnly(2025, 07, 01), 
                    Value = new Money(600_000, "PLN", 600_000)
                }
            ],
            FinancedBy = new Debt
            {
                Id = Guid.NewGuid(),
                Name = "Mortgage",
                AmountHistory = [
                    new HistoricValue
                    {
                        Id = Guid.NewGuid(),
                        Date = new DateOnly(2025, 04, 01), 
                        Value = new Money(320_000, "PLN", 320_000)
                    },
                    new HistoricValue
                    {
                        Id = Guid.NewGuid(),
                        Date = new DateOnly(2025, 07, 01), 
                        Value = new Money(300_000, "PLN", 300_000)
                    }
                ]
            }
        },
        new Asset
        {
            Id = Guid.NewGuid(),
            Name = "Car",
            ValueHistory = [
                new HistoricValue
                {
                    Id = Guid.NewGuid(),
                    Date = new DateOnly(2025, 04, 01), 
                    Value = new Money(50_000, "PLN", 50_000)
                },
                new HistoricValue
                {
                    Id = Guid.NewGuid(),
                    Date = new DateOnly(2025, 07, 01), 
                    Value = new Money(40_000, "PLN", 40_000)
                }
            ]
        }
    ],
    Debts = [
        new Debt
        {
            Id = Guid.NewGuid(),
            Name = "Dryer",
            AmountHistory = [
                new HistoricValue
                {
                    Id = Guid.NewGuid(),
                    Date = new DateOnly(2025, 04, 01), 
                    Value = new Money(2_100, "PLN", 2_100)
                },
                new HistoricValue
                {
                    Id = Guid.NewGuid(),
                    Date = new DateOnly(2025, 07, 01), 
                    Value = new Money(2_000, "PLN", 2_000)
                }
            ]
        }
    ]
};

var dbContext = new FinanceTrackerContext();
await dbContext.Database.MigrateAsync();
// await dbContext.Portfolios.AddAsync(portfolio);
// await dbContext.SaveChangesAsync();

var p1 = dbContext.Portfolios.First();

await dbContext.Portfolios
    .Include(x => x.Wallets)
    .Include(x => x.Assets)
    .Include(x => x.Debts)
    .LoadAsync();
    
var p2 = dbContext.Portfolios.First();
Console.WriteLine($"Value: {p2.LatestValue}");