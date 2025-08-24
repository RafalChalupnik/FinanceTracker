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

        var bankAccountAllocationId = await SeedPhysicalAllocation(context, "Bank Account", displaySequence: 1);
        await SeedEmergencyFund(context, startYear, endDate, bankAccountAllocationId);
        await SeedLongTermWallet(context, startYear, endDate, bankAccountAllocationId);

        await SeedInflationValues(context, startYear, endDate);
        
        await SeedAssets(context, startYear, endDate);
        await SeedDebts(context, startYear, endDate);

        await context.SaveChangesAsync();
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
        
        var cashPhysicalAllocationId = await SeedPhysicalAllocation(context, "Cash", displaySequence: 2);

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
            maxValue: 5_000
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
                    .Select(value => value.ToComponentValue(cashEur.Id, cashPhysicalAllocationId, currency: "EUR")))
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

    private static async ValueTask<Guid> SeedPhysicalAllocation(FinanceTrackerContext context, string name, int displaySequence)
    {
        var physicalAllocation = new PhysicalAllocation
        {
            Name = name,
            DisplaySequence = displaySequence
        };
        
        await context.PhysicalAllocations.AddAsync(physicalAllocation);

        return physicalAllocation.Id;
    }
    
    private static async ValueTask SeedInflationValues(
        FinanceTrackerContext context, 
        int startYear, 
        DateOnly endDate)
    {
        var inflationValues = GenerateValues(
            startYear: startYear,
            endDate: endDate,
            monthInterval: 1,
            minValue: -1,
            maxValue: 5
        );
        
        await context.InflationValues.AddRangeAsync(
            inflationValues
                .Select((value, index) => new InflationHistoricValue
                {
                    Year = value.Date.Year,
                    Month = value.Date.Month,
                    Value = value.Value / 100,
                    // Let's set inflation to unconfirmed for the last 3 months
                    Confirmed = index < inflationValues.Count - 3
                })
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
        int maxValue)
    {
        // Start with the end of the first quarter
        var currentDate = new DateOnly(year: startYear, month: 1, day: 1).AddMonths(monthInterval).AddDays(-1);
        var values = new List<DateValue>();

        while (currentDate < endDate)
        {
            values.Add(
                new DateValue(
                    Date: currentDate,
                    Value: GenerateRandomDecimalValue(minValue, maxValue)
                )
            );

            // End of next quarter
            currentDate = currentDate.AddDays(1).AddMonths(monthInterval).AddDays(-1);
        }
        
        values.Add(
            new DateValue(
                Date: currentDate,
                Value: GenerateRandomDecimalValue(minValue, maxValue)
            )
        );

        return values;
    }

    private static decimal GenerateRandomDecimalValue(int min, int max)
    {
        return (decimal)Random.Shared.Next(min * 100, max * 100) / 100;
    }

    private record DateValue(DateOnly Date, decimal Value)
    {
        private const string DefaultCurrency = "PLN";
        
        public HistoricValue ToAssetValue(Guid assetId, string currency = DefaultCurrency)
            => HistoricValue.CreateAssetValue(Date, ToMoney(Value, currency), assetId);

        public HistoricValue ToComponentValue(Guid componentId, Guid? physicalAllocationId, string currency = DefaultCurrency)
            => HistoricValue.CreateComponentValue(Date, ToMoney(Value, currency), componentId, physicalAllocationId);
        
        public HistoricValue ToDebtValue(Guid debtId, string currency = DefaultCurrency)
            => HistoricValue.CreateDebtValue(Date, ToMoney(Value, currency), debtId);

        public WalletTarget ToWalletTarget(Guid walletId) => new()
        {
            WalletId = walletId,
            Date = Date,
            ValueInMainCurrency = Value
        };
        
        private static Money ToMoney(decimal amount, string currency)
        {
            if (currency == "PLN")
            {
                return new Money(amount, currency, amount);
            }
            
            var exchangeRate = (decimal) Random.Shared.NextDouble() / 2 * 10;
            
            return new Money(
                amount, 
                currency, 
                amount * exchangeRate
            );
        }
    }
}