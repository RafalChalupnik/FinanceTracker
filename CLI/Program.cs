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
                    ValueHistory: new Dictionary<DateOnly, decimal> {
                        {new DateOnly(2025, 04, 01), 20_000}
                    }
                ),
                new Component(
                    Name: "Cash - PLN",
                    Currency: "PLN",
                    ValueHistory: new Dictionary<DateOnly, decimal> {
                        {new DateOnly(2025, 04, 01), 5_000}
                    }
                ),
                new Component(
                    Name: "Cash - CAD",
                    Currency: "CAD",
                    ValueHistory: new Dictionary<DateOnly, decimal> {
                        {new DateOnly(2025, 04, 01), 1_800}
                    }
                ),
                new Component(
                    Name: "Bonds",
                    Currency: "PLN",
                    ValueHistory: new Dictionary<DateOnly, decimal> {
                        {new DateOnly(2025, 04, 01), 20_000}
                    }
                ),
                new Component(
                    Name: "Bonds - Retirement account",
                    Currency: "PLN",
                    ValueHistory: new Dictionary<DateOnly, decimal> {
                        {new DateOnly(2025, 04, 01), 10_000}
                    }
                )
            ],
            Target: new Money(60_000, "PLN")
        ),
        new Wallet(
            Name: "Long-term wallet",
            Components: [
                new Component(
                    Name: "Bonds",
                    Currency: "PLN",
                    ValueHistory: new Dictionary<DateOnly, decimal> {
                        {new DateOnly(2025, 04, 01), 15_000}
                    }
                ),
                new Component(
                    Name: "Stocks",
                    Currency: "PLN",
                    ValueHistory: new Dictionary<DateOnly, decimal> {
                        {new DateOnly(2025, 04, 01), 25_000}
                    }
                )
            ]
        )
    ],
    Assets: [
        new Asset(
            Name: "Home",
            ValueHistory: new Dictionary<DateOnly, decimal> {
                {new DateOnly(2025, 04, 01), 500_000},
                {new DateOnly(2025, 07, 01), 600_000}
            },
            FinancedBy: new Debt(
                "Mortgage",
                AmountHistory: new Dictionary<DateOnly, decimal> {
                    {new DateOnly(2025, 04, 01), 320_000},
                    {new DateOnly(2025, 07, 01), 300_000}
                }
            )
        ),
        new Asset(
            Name: "Car",
            ValueHistory: new Dictionary<DateOnly, decimal> {
                {new DateOnly(2025, 04, 01), 50_000},
                {new DateOnly(2025, 07, 01), 40_000}
            }
        )
    ],
    Debts: [
        new Debt(
            "Dryer",
            AmountHistory: new Dictionary<DateOnly, decimal> {
                {new DateOnly(2025, 04, 01), 2_100},
                {new DateOnly(2025, 07, 01), 2_000}
            }
        )
    ]
);