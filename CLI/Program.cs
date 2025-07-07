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

// Logical wallets

var emergencyFund = new LogicalWallet(
    Name: "Emergency Fund",
    Allocations: new Dictionary<PhysicalWallet, decimal>
    {
        {savingsAccount, 20_000},
        {cashPln, 5_000},
        {cashCad, 1_800},
        {bonds, 20_000},
        {retirementBondsAccount, 10_000}
    },
    Target: 60_000
);

var longTermWallet = new LogicalWallet(
    Name: "Long-term wallet",
    Allocations: new Dictionary<PhysicalWallet, decimal>
    {
        {retirementBondsAccount, 15_000},
        {retirementStocksAccount, 25_000}
    },
    Target: null
);

var portfolio = new Portfolio(
    Wallets: [
        emergencyFund,
        longTermWallet
    ],
    Assets: [
        new Asset(
            Name: "Home",
            Value: 500_000
            ),
        new Asset(
            Name: "Car",
            Value: 50_000
            )
    ],
    Debts: [
        new Debt(
            "Mortgage",
            Amount: 300_000
            ),
        new Debt(
            "Dryer",
            Amount: 2_000
            )
    ]
    );
    
var value = portfolio.CalculateValue(conversions);

Console.WriteLine($"Portfolio value: {value}");