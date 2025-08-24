using FinanceTracker.Core;
using FinanceTracker.Core.Primitives;

namespace FinanceTracker.Web;

internal static class Seeder
{
    public static async ValueTask SeedDataIfNecessary(FinanceTrackerContext context)
    {
        if (context.Assets.Any() == false && context.Debts.Any() == false && context.Wallets.Any() == false)
        {
            await SeedData(context);
        }
    }
    
    private static async ValueTask SeedData(FinanceTrackerContext context)
    {
        var endDate = DateOnly.FromDateTime(DateTime.Today);
        var startYear = endDate.Year - 2;

        var bankAccountAllocationId = await SeedPhysicalAllocation(context, "Bank Account");
        await SeedEmergencyFund(context, startYear, endDate, bankAccountAllocationId);
        await SeedLongTermWallet(context, startYear, endDate, bankAccountAllocationId);
        
        await SeedAssets(context, startYear, endDate);
        await SeedDebts(context, startYear, endDate);

        await context.SaveChangesAsync();
        
        // ---
        
        // var today = DateOnly.FromDateTime(DateTime.Now);
        // var dummyValue = new Money(100, "PLN", 100);
        //
        // var bankAccount = new Component
        // {
        //     Name = "Bank Account",
        //     DisplaySequence = 1,
        // };
        // // bankAccount.SetValue(today, dummyValue);
        //
        // var cash = new Component
        // {
        //     Name = "Cash",
        //     DisplaySequence = 2,
        // };
        // // cash.SetValue(today, dummyValue);
        //
        // var emergencyFund = new Wallet
        // {
        //     Name = "Emergency Fund",
        //     DisplaySequence = 1
        // };
        // emergencyFund.Add(bankAccount);
        // emergencyFund.Add(cash);
        //
        // var bonds = new Component
        // {
        //     Name = "Bonds",
        //     DisplaySequence = 1,
        // };
        // // bonds.SetValue(today, dummyValue);
        //
        // var stocks = new Component
        // {
        //     Name = "Stocks",
        //     DisplaySequence = 2,       
        // };
        // // stocks.SetValue(today, dummyValue);
        //
        // var longTermWallet = new Wallet
        // {
        //     Name = "Long-Term Wallet",
        //     DisplaySequence = 2
        // };
        // longTermWallet.Add(bonds);
        // longTermWallet.Add(stocks);
        //
        // var home = new Asset
        // {
        //     Name = "Home",
        //     DisplaySequence = 1
        // };
        // // home.SetValue(today, dummyValue);
        //
        // var car = new Asset
        // {
        //     Name = "Car",
        //     DisplaySequence = 2,
        // };
        // // car.SetValue(today, dummyValue);
        //
        // var mortgage = new Debt
        // {
        //     Name = "Mortgage",
        //     DisplaySequence = 1
        // };
        // // mortgage.SetValue(today, dummyValue);
        //
        // var carPayment = new Debt
        // {
        //     Name = "Car Payment",
        //     DisplaySequence = 2
        // };
        // // carPayment.SetValue(today, dummyValue);
        //
        // context.Add(emergencyFund);
        // context.Add(longTermWallet);
        // context.Add(home);
        // context.Add(car);
        // context.Add(mortgage);
        // context.Add(carPayment);
    }
    
    private static async ValueTask SeedEmergencyFund(
        FinanceTrackerContext context, 
        int startYear, 
        DateOnly endDate,
        Guid bankAccountAllocationId)
    {
        var emergencyFund = new Wallet
        {
            Name = "Emergency Fund",
            DisplaySequence = 1
        };

        var bankAccount = new Component
        {
            Name = "Bank Account",
            DisplaySequence = 1,
            DefaultPhysicalAllocationId = bankAccountAllocationId
        };
        emergencyFund.Add(bankAccount);
        
        var cashPhysicalAllocationId = await SeedPhysicalAllocation(context, "Cash");

        var cashPln = new Component
        {
            Name = "Cash (PLN)",
            DisplaySequence = 2,
            DefaultPhysicalAllocationId = cashPhysicalAllocationId
        };
        emergencyFund.Add(cashPln);
        
        var cashEur = new Component
        {
            Name = "Cash (EUR)",
            DisplaySequence = 3,
            DefaultPhysicalAllocationId = cashPhysicalAllocationId
        };
        emergencyFund.Add(cashEur);
        
        var bankAccountHistory = GenerateValues(
            startYear: startYear,
            endDate: endDate,
            monthInterval: 1,
            minValue: 50_000,
            maxValue: 100_000
        );
        
        var cashPlnHistory = GenerateValues(
            startYear: startYear,
            endDate: endDate,
            monthInterval: 1,
            minValue: 5_000,
            maxValue: 20_000
        );
        
        var cashEurHistory = GenerateValues(
            startYear: startYear,
            endDate: endDate,
            monthInterval: 1,
            minValue: 1_000,
            maxValue: 5_000,
            currency: "EUR"
        );
        
        var targets = GenerateValues(
            startYear: startYear,
            endDate: endDate,
            monthInterval: 3,
            minValue: 70_000,
            maxValue: 120_000
        );

        await context.Wallets.AddAsync(emergencyFund);
        
        await context.HistoricValues.AddRangeAsync(
            bankAccountHistory
                .Select(value => value.ToComponentValue(bankAccount.Id, bankAccountAllocationId))
                .Concat(cashPlnHistory
                    .Select(value => value.ToComponentValue(cashPln.Id, cashPhysicalAllocationId)))
                .Concat(cashEurHistory
                    .Select(value => value.ToComponentValue(cashEur.Id, cashPhysicalAllocationId)))
        );

        await context.WalletTargets.AddRangeAsync(
            targets
                .Select(target => target.ToWalletTarget(emergencyFund.Id))
        );
    }
    
    private static async ValueTask SeedLongTermWallet(
        FinanceTrackerContext context, 
        int startYear, 
        DateOnly endDate,
        Guid bankAccountAllocationId)
    {
        var longTermWallet = new Wallet
        {
            Name = "Long-Term Wallet",
            DisplaySequence = 2
        };

        var bankAccount = new Component
        {
            Name = "Bank Account",
            DisplaySequence = 1,
            DefaultPhysicalAllocationId = bankAccountAllocationId
        };
        longTermWallet.Add(bankAccount);
        
        var bonds = new Component
        {
            Name = "Bonds",
            DisplaySequence = 2,
            DefaultPhysicalAllocationId = null
        };
        longTermWallet.Add(bonds);
        
        var stocks = new Component
        {
            Name = "Stocks",
            DisplaySequence = 3,
            DefaultPhysicalAllocationId = null
        };
        longTermWallet.Add(stocks);
        
        var bankAccountHistory = GenerateValues(
            startYear: startYear,
            endDate: endDate,
            monthInterval: 1,
            minValue: 5_000,
            maxValue: 10_000
        );
        
        var bondsHistory = GenerateValues(
            startYear: startYear,
            endDate: endDate,
            monthInterval: 1,
            minValue: 20_000,
            maxValue: 30_000
        );
        
        var stocksHistory = GenerateValues(
            startYear: startYear,
            endDate: endDate,
            monthInterval: 1,
            minValue: 30_000,
            maxValue: 50_000
        );
        
        await context.Wallets.AddAsync(longTermWallet);
        
        await context.HistoricValues.AddRangeAsync(
            bankAccountHistory
                .Select(value => value.ToComponentValue(bankAccount.Id, bankAccountAllocationId))
                .Concat(bondsHistory
                    .Select(value => value.ToComponentValue(bonds.Id, physicalAllocationId: null)))
                .Concat(stocksHistory
                    .Select(value => value.ToComponentValue(stocks.Id, physicalAllocationId: null)))
        );
    }

    private static async ValueTask<Guid> SeedPhysicalAllocation(FinanceTrackerContext context, string name)
    {
        var physicalAllocation = new PhysicalAllocation
        {
            Name = name,
            DisplaySequence = context.PhysicalAllocations
                .OrderByDescending(x => x.DisplaySequence)
                .FirstOrDefault()?.DisplaySequence + 1 ?? 1
        };
        
        await context.PhysicalAllocations.AddAsync(physicalAllocation);

        return physicalAllocation.Id;
    }

    private static async ValueTask SeedAssets(FinanceTrackerContext context, int startYear, DateOnly endDate)
    {
        var home = new Asset
        {
            Name = "Home",
            DisplaySequence = 1
        };

        var car = new Asset
        {
            Name = "Car",
            DisplaySequence = 2,
        };

        var homeValueHistory = GenerateValues(
            startYear: startYear,
            endDate: endDate,
            monthInterval: 3,
            minValue: 300_000,
            maxValue: 800_000
        );
        
        var carValueHistory = GenerateValues(
            startYear: startYear,
            endDate: endDate,
            monthInterval: 3,
            minValue: 40_000,
            maxValue: 75_000
        );

        await context.Assets.AddRangeAsync(home, car);
        
        await context.HistoricValues.AddRangeAsync(
            homeValueHistory
                .Select(value => value.ToAssetValue(home.Id))
                .Concat(carValueHistory
                    .Select(value => value.ToAssetValue(car.Id)))
        );
    }
    
    private static async ValueTask SeedDebts(FinanceTrackerContext context, int startYear, DateOnly endDate)
    {
        var mortgage = new Debt
        {
            Name = "Mortgage",
            DisplaySequence = 1
        };

        var carPayment = new Debt
        {
            Name = "Car Payment",
            DisplaySequence = 2,
        };

        var mortgageHistory = GenerateValues(
            startYear: startYear,
            endDate: endDate,
            monthInterval: 3,
            minValue: -500_000,
            maxValue: -200_000
        );
        
        var carPaymentHistory = GenerateValues(
            startYear: startYear,
            endDate: endDate,
            monthInterval: 3,
            minValue: -60_000,
            maxValue: -5_000
        );

        await context.Debts.AddRangeAsync(mortgage, carPayment);
        
        await context.HistoricValues.AddRangeAsync(
            mortgageHistory
                .Select(value => value.ToDebtValue(mortgage.Id))
                .Concat(carPaymentHistory
                    .Select(value => value.ToDebtValue(carPayment.Id)))
        );
    }

    private static List<DateValue> GenerateValues(
        int startYear,
        DateOnly endDate, 
        int monthInterval,
        int minValue, 
        int maxValue,
        string currency = "PLN")
    {
        // Start with the end of the first quarter
        var currentDate = new DateOnly(year: startYear, month: 1, day: 1).AddMonths(monthInterval).AddDays(-1);
        var values = new List<DateValue>();

        while (currentDate < endDate)
        {
            values.Add(
                new DateValue(
                    Date: currentDate,
                    Value: GenerateRandomValue(minValue, maxValue, currency)
                )
            );

            // End of next quarter
            currentDate = currentDate.AddDays(1).AddMonths(monthInterval).AddDays(-1);
        }
        
        values.Add(
            new DateValue(
                Date: currentDate,
                Value: GenerateRandomValue(minValue, maxValue, currency)
            )
        );

        return values;
    }

    private static Money GenerateRandomValue(int min, int max, string currency)
    {
        // Generate decimals as well
        var value = (decimal)Random.Shared.Next(min * 100, max * 100) / 100;
        
        return new Money(
            Amount: value, 
            Currency: currency, 
            AmountInMainCurrency: value
        );
    }

    private record DateValue(DateOnly Date, Money Value)
    {
        public HistoricValue ToAssetValue(Guid assetId)
            => HistoricValue.CreateAssetValue(Date, Value, assetId);

        public HistoricValue ToComponentValue(Guid componentId, Guid? physicalAllocationId)
            => HistoricValue.CreateComponentValue(Date, Value, componentId, physicalAllocationId);
        
        public HistoricValue ToDebtValue(Guid debtId)
            => HistoricValue.CreateDebtValue(Date, Value, debtId);

        public WalletTarget ToWalletTarget(Guid walletId) => new()
        {
            WalletId = walletId,
            Date = Date,
            ValueInMainCurrency = Value.AmountInMainCurrency
        };
    }
}