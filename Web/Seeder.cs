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

        await SeedEmergencyFund(context, startYear, endDate);
        
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
        DateOnly endDate)
    {
        var emergencyFund = new Wallet
        {
            Name = "Emergency Fund",
            DisplaySequence = 1
        };

        var bankAccount = new Component
        {
            Name = "Bank Account",
            DisplaySequence = 1
        };
        emergencyFund.Add(bankAccount);

        var cashPln = new Component
        {
            Name = "Cash (PLN)",
            DisplaySequence = 2
        };
        emergencyFund.Add(cashPln);
        
        var cashEur = new Component
        {
            Name = "Cash (EUR)",
            DisplaySequence = 3
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
                .Select(value => value.ToComponentValue(bankAccount.Id))
                .Concat(cashPlnHistory
                    .Select(value => value.ToComponentValue(cashPln.Id)))
                .Concat(cashEurHistory
                    .Select(value => value.ToComponentValue(cashEur.Id)))
        );

        await context.WalletTargets.AddRangeAsync(
            targets
                .Select(target => target.ToWalletTarget(emergencyFund.Id))
        );
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

        public HistoricValue ToComponentValue(Guid componentId)
            => HistoricValue.CreateComponentValue(Date, Value, componentId, physicalAllocationId: null);
        
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