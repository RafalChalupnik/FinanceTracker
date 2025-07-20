// See https://aka.ms/new-console-template for more information

using FinanceTracker.Core;
using FinanceTracker.Core.Primitives;

var portfolio = new Portfolio(
    Wallets: [
        new Wallet(
            Name: "Emergency Fund",
            Components: [
                new Component(
                    Name: "Savings account",
                    Currency: "PLN",
                    ValueHistory: new Dictionary<DateOnly, Money> {
                        {
                            new DateOnly(2025, 04, 01), 
                            new Money(20_000, "PLN", 20_000)
                        }
                    }
                ),
                new Component(
                    Name: "Cash - PLN",
                    Currency: "PLN",
                    ValueHistory: new Dictionary<DateOnly, Money> {
                        {
                            new DateOnly(2025, 04, 01), 
                            new Money(5_000, "PLN", 5_000)
                        }
                    }
                ),
                new Component(
                    Name: "Cash - CAD",
                    Currency: "CAD",
                    ValueHistory: new Dictionary<DateOnly, Money> {
                        {
                            new DateOnly(2025, 04, 01), 
                            new Money(1_800, "CAD", 4_788.31m)
                        }
                    }
                ),
                new Component(
                    Name: "Bonds",
                    Currency: "PLN",
                    ValueHistory: new Dictionary<DateOnly, Money> {
                        {
                            new DateOnly(2025, 04, 01), 
                            new Money(20_000, "PLN", 20_000)
                        }
                    }
                ),
                new Component(
                    Name: "Bonds - Retirement account",
                    Currency: "PLN",
                    ValueHistory: new Dictionary<DateOnly, Money> {
                        {
                            new DateOnly(2025, 04, 01), 
                            new Money(10_000, "PLN", 10_000)
                        }
                    }
                )
            ],
            Target: 60_000
        ),
        new Wallet(
            Name: "Long-term wallet",
            Components: [
                new Component(
                    Name: "Bonds",
                    Currency: "PLN",
                    ValueHistory: new Dictionary<DateOnly, Money> {
                        {
                            new DateOnly(2025, 04, 01), 
                            new Money(15_000, "PLN", 15_000)
                        }
                    }
                ),
                new Component(
                    Name: "Stocks",
                    Currency: "PLN",
                    ValueHistory: new Dictionary<DateOnly, Money> {
                        {
                            new DateOnly(2025, 04, 01), 
                            new Money(25_000, "PLN", 25_000)
                        }
                    }
                )
            ]
        )
    ],
    Assets: [
        new Asset(
            Name: "Home",
            ValueHistory: new Dictionary<DateOnly, Money> {
                {
                    new DateOnly(2025, 04, 01), 
                    new Money(500_000, "PLN", 500_000)
                },
                {
                    new DateOnly(2025, 07, 01), 
                    new Money(600_000, "PLN", 600_000)
                }
            },
            FinancedBy: new Debt(
                "Mortgage",
                AmountHistory: new Dictionary<DateOnly, Money> {
                    {
                        new DateOnly(2025, 04, 01), 
                        new Money(320_000, "PLN", 320_000)
                    },
                    {
                        new DateOnly(2025, 07, 01), 
                        new Money(300_000, "PLN", 300_000)
                    }
                }
            )
        ),
        new Asset(
            Name: "Car",
            ValueHistory: new Dictionary<DateOnly, Money> {
                {
                    new DateOnly(2025, 04, 01), 
                    new Money(50_000, "PLN", 50_000)
                },
                {
                    new DateOnly(2025, 07, 01), 
                    new Money(40_000, "PLN", 40_000)
                }
            }
        )
    ],
    Debts: [
        new Debt(
            "Dryer",
            AmountHistory: new Dictionary<DateOnly, Money> {
                {
                    new DateOnly(2025, 04, 01), 
                    new Money(2_100, "PLN", 2_100)
                },
                {
                    new DateOnly(2025, 07, 01), 
                    new Money(2_000, "PLN", 2_000)
                }
            }
        )
    ]
);