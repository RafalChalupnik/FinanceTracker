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
                    ValueHistory: [
                        new Snapshot<decimal>(
                            new DateOnly(2025, 04, 01),
                            Value: 20_000
                        )
                    ]
                ),
                new Component(
                    Name: "Cash - PLN",
                    Currency: "PLN",
                    ValueHistory: [
                        new Snapshot<decimal>(
                            new DateOnly(2025, 04, 01),
                            Value: 5_000
                        )
                    ]
                ),
                new Component(
                    Name: "Cash - CAD",
                    Currency: "CAD",
                    ValueHistory: [
                        new Snapshot<decimal>(
                            new DateOnly(2025, 04, 01),
                            Value: 1_800
                        )
                    ]
                ),
                new Component(
                    Name: "Bonds",
                    Currency: "PLN",
                    ValueHistory: [
                        new Snapshot<decimal>(
                            new DateOnly(2025, 04, 01),
                            Value: 20_000
                        )
                    ]
                ),
                new Component(
                    Name: "Bonds - Retirement account",
                    Currency: "PLN",
                    ValueHistory: [
                        new Snapshot<decimal>(
                            new DateOnly(2025, 04, 01),
                            Value: 10_000
                        )
                    ]
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
                    ValueHistory: [
                        new Snapshot<decimal>(
                            new DateOnly(2025, 04, 01),
                            Value: 15_000
                        )
                    ]
                ),
                new Component(
                    Name: "Stocks",
                    Currency: "PLN",
                    ValueHistory: [
                        new Snapshot<decimal>(
                            new DateOnly(2025, 04, 01),
                            Value: 25_000
                        )
                    ]
                )
            ]
        )
    ],
    Assets: [
        new Asset(
            Name: "Home",
            ValueHistory: [
                new Snapshot<decimal>(
                    Date: new DateOnly(2025, 04, 01),
                    Value: 500_000
                ),
                new Snapshot<decimal>(
                    Date: new DateOnly(2025, 07, 01),
                    Value: 600_000
                )
            ],
            FinancedBy: new Debt(
                "Mortgage",
                AmountHistory: [
                    new Snapshot<decimal>(
                        Date: new DateOnly(2025, 04, 01),
                        Value: 320_000
                    ),
                    new Snapshot<decimal>(
                        Date: new DateOnly(2025, 07, 01),
                        Value: 300_000
                    )
                ]
            )
        ),
        new Asset(
            Name: "Car",
            ValueHistory: [
                new Snapshot<decimal>(
                    Date: new DateOnly(2025, 04, 01),
                    Value: 50_000
                ),
                new Snapshot<decimal>(
                    Date: new DateOnly(2025, 07, 01),
                    Value: 40_000
                )
            ]
        )
    ],
    Debts: [
        new Debt(
            "Dryer",
            AmountHistory: [
                new Snapshot<decimal>(
                    Date: new DateOnly(2025, 04, 01),
                    Value: 2_100
                ),
                new Snapshot<decimal>(
                    Date: new DateOnly(2025, 07, 01),
                    Value: 2_000
                )
            ]
        )
    ]
);