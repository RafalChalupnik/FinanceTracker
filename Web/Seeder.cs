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

        // await SeedComponents(context);
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

    private static async ValueTask SeedComponents(FinanceTrackerContext context)
    {
        var wallet = new Wallet
        {
            Name = "Dummy",
            DisplaySequence = 1
        };
        
        var component = new Component
        {
            Name = "Dummy",
            DisplaySequence = 1,       
        };

        wallet.Add(component);

        var physical = new PhysicalAllocation
        {
            Name = "Dummy",
            DisplaySequence = 1
        };

        await context.Wallets.AddAsync(wallet);
        await context.PhysicalAllocations.AddAsync(physical);
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

        var homeValueHistory = GenerateAssetValues(
            assetId: home.Id,
            startYear: startYear,
            endDate: endDate,
            minValue: 300_000,
            maxValue: 800_000);
        
        var carValueHistory = GenerateAssetValues(
            assetId: car.Id,
            startYear: startYear,
            endDate: endDate,
            minValue: 40_000,
            maxValue: 75_000);

        await context.Assets.AddRangeAsync(home, car);
        await context.HistoricValues.AddRangeAsync(homeValueHistory.Concat(carValueHistory));
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

        var mortgageHistory = GenerateDebtValues(
            debtId: mortgage.Id,
            startYear: startYear,
            endDate: endDate,
            minValue: -500_000,
            maxValue: -200_000);
        
        var carPaymentHistory = GenerateDebtValues(
            debtId: carPayment.Id,
            startYear: startYear,
            endDate: endDate,
            minValue: -60_000,
            maxValue: -5_000);

        await context.Debts.AddRangeAsync(mortgage, carPayment);
        await context.HistoricValues.AddRangeAsync(mortgageHistory.Concat(carPaymentHistory));
    }

    private static List<HistoricValue> GenerateAssetValues(
        Guid assetId,
        int startYear,
        DateOnly endDate, 
        int minValue, 
        int maxValue)
    {
        // Start with the end of the first quarter
        var currentDate = new DateOnly(year: startYear, month: 1, day: 1).AddMonths(3).AddDays(-1);
        var values = new List<HistoricValue>();

        while (currentDate < endDate)
        {
            values.Add(
                HistoricValue.CreateAssetValue(
                    date: currentDate,
                    value: GenerateRandomValue(minValue, maxValue),
                    assetId: assetId
                )
            );

            // End of next quarter
            currentDate = currentDate.AddDays(1).AddMonths(3).AddDays(-1);
        }
        
        values.Add(
            HistoricValue.CreateAssetValue(
                date: endDate,
                value: GenerateRandomValue(minValue, maxValue),
                assetId: assetId
            )
        );

        return values;
    }
    
    private static List<HistoricValue> GenerateDebtValues(
        Guid debtId,
        int startYear,
        DateOnly endDate, 
        int minValue, 
        int maxValue)
    {
        // Start with the end of the first quarter
        var currentDate = new DateOnly(year: startYear, month: 1, day: 1).AddMonths(3).AddDays(-1);
        var values = new List<HistoricValue>();

        while (currentDate < endDate)
        {
            values.Add(
                HistoricValue.CreateDebtValue(
                    date: currentDate,
                    value: GenerateRandomValue(minValue, maxValue),
                    debtId: debtId
                )
            );

            // End of next quarter
            currentDate = currentDate.AddDays(1).AddMonths(3).AddDays(-1);
        }
        
        values.Add(
            HistoricValue.CreateDebtValue(
                date: endDate,
                value: GenerateRandomValue(minValue, maxValue),
                debtId: debtId
            )
        );

        return values;
    }

    private static Money GenerateRandomValue(int min, int max)
    {
        var value = (decimal)Random.Shared.Next(min * 100, max * 100) / 100;
        
        return new Money(
            Amount: value, 
            Currency: "PLN", 
            AmountInMainCurrency: value
        );
    }
}