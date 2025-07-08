// See https://aka.ms/new-console-template for more information

using FinanceTracker.Core;

// Physical wallets

var conversions = new Dictionary<string, decimal>
{
    {"PLN", 1.00m},
    {"CAD", 2.66m}
};

var savingsAccount = new PhysicalWallet(
    "Savings account",
    Currency: "PLN"
    );

var cashPln = new PhysicalWallet(
    Name: "Cash - PLN",
    Currency: "PLN"
);

var cashCad = new PhysicalWallet(
    Name: "Cash - CAD",
    Currency: "CAD"
);

var bonds = new PhysicalWallet(
    "Bonds",
    Currency: "PLN"
);

var retirementBondsAccount = new PhysicalWallet(
    Name: "Retirement Account - Bonds",
    Currency: "PLN"
    );

var retirementStocksAccount = new PhysicalWallet(
    Name: "Retirement Account - Stocks",
    Currency: "PLN"
);

// Ledger

var ledger = new Ledger();

// Logical wallets

var emergencyFund = new LogicalWallet(
    Name: "Emergency Fund",
    Ledger: ledger,
    Target: 60_000
);

var longTermWallet = new LogicalWallet(
    Name: "Long-term wallet",
    Ledger: ledger,
    Target: null
);

// Transactions

ledger.AddRange([
    new Transaction(
        Date: new DateOnly(2025, 04, 01),
        From: null,
        To: new Allocation(emergencyFund, savingsAccount, 20_000)
    ),
    new Transaction(
        Date: new DateOnly(2025, 04, 01),
        From: null,
        To: new Allocation(emergencyFund, cashPln, 5_000)
    ),
    new Transaction(
        Date: new DateOnly(2025, 04, 01),
        From: null,
        To: new Allocation(emergencyFund, cashCad, 1_800)
    ),
    new Transaction(
        Date: new DateOnly(2025, 04, 01),
        From: null,
        To: new Allocation(emergencyFund, bonds, 20_000)
    ),
    new Transaction(
        Date: new DateOnly(2025, 04, 01),
        From: null,
        To: new Allocation(emergencyFund, retirementBondsAccount, 10_000)
    ),
    new Transaction(
        Date: new DateOnly(2025, 04, 01),
        From: null,
        To: new Allocation(longTermWallet, retirementBondsAccount, 15_000)
    ),
    new Transaction(
        Date: new DateOnly(2025, 04, 01),
        From: null,
        To: new Allocation(longTermWallet, retirementStocksAccount, 25_000)
    ),
]);

var portfolio = new Portfolio(
    Wallets: [
        emergencyFund,
        longTermWallet
    ],
    Assets: [
        new Asset(
            Name: "Home",
            ValueHistory: [
                (new DateOnly(2025, 04, 01), new Money(Amount: 500_000, Currency: "PLN")),
                (new DateOnly(2025, 07, 01), new Money(Amount: 600_000, Currency: "PLN"))
            ]),
        new Asset(
            Name: "Car",
            ValueHistory: [
                (new DateOnly(2025, 04, 01), new Money(Amount: 50_000, Currency: "PLN")),
                (new DateOnly(2025, 07, 01), new Money(Amount: 40_000, Currency: "PLN"))
            ])
    ],
    Debts: [
        new Debt(
            "Mortgage",
            AmountHistory: [
                (new DateOnly(2025, 04, 01), new Money(Amount: 320_000, Currency: "PLN")),
                (new DateOnly(2025, 07, 01), new Money(Amount: 300_000, Currency: "PLN"))
            ]),
        new Debt(
            "Dryer",
            AmountHistory: [
                (new DateOnly(2025, 04, 01), new Money(Amount: 2_100, Currency: "PLN")),
                (new DateOnly(2025, 07, 01), new Money(Amount: 2_000, Currency: "PLN"))
            ])
    ]
    );
    
var value = portfolio.CalculateValue(conversions);

Console.WriteLine($"Portfolio value: {value}");