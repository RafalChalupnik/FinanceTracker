using FinanceTracker.Core;
using FinanceTracker.Core.Entities;
using FinanceTracker.Core.Primitives;

namespace FinanceTracker.Web;

internal static class Seeder
{
    public static async ValueTask SeedDataIfNecessary(FinanceTrackerContext context)
    {
        if (context.HistoricValues.Any() == false)
        {
            await SeedData(context);
        }
    }
    
    private static async ValueTask SeedData(FinanceTrackerContext context)
    {
        var endDate = DateOnly.FromDateTime(DateTime.Today);
        var startYear = endDate.Year - 2;

        FixGroupTypes(context);
        var bankAccountAllocationId = await SeedPhysicalAllocation(context, "Bank Account", displaySequence: 1);

        var walletsGroupTypeId = GetGroupTypeId(context, "Wallets");
        
        await SeedEmergencyFund(context, walletsGroupTypeId, startYear, endDate, bankAccountAllocationId);
        await SeedLongTermWallet(context, walletsGroupTypeId, startYear, endDate, bankAccountAllocationId);

        await SeedInflationValues(context, startYear, endDate);
        
        await SeedAssets(context, startYear, endDate);
        await SeedDebts(context, startYear, endDate);

        await context.SaveChangesAsync();
    }

    private static void FixGroupTypes(FinanceTrackerContext context)
    {
        var wallets = context.GroupTypes.Single(groupType => groupType.Name == "Wallets");
        wallets.DisplaySequence = 1;
        wallets.IconName = "WalletOutlined";
        
        var assets = context.GroupTypes.Single(groupType => groupType.Name == "Assets");
        assets.DisplaySequence = 2;
        assets.IconName = "PlusSquareOutlined";
        
        var debts = context.GroupTypes.Single(groupType => groupType.Name == "Debts");
        debts.DisplaySequence = 3;
        debts.IconName = "MinusSquareOutlined";
    }
    
    private static Guid GetGroupTypeId(FinanceTrackerContext context, string name) =>
        context.GroupTypes.Single(groupType => groupType.Name == name).Id;
    
    private static async ValueTask SeedEmergencyFund(
        FinanceTrackerContext context, 
        Guid groupTypeId,
        int startYear, 
        DateOnly endDate,
        Guid bankAccountAllocationId)
    {
        var emergencyFund = new Group
        {
            Name = "Emergency Fund",
            DisplaySequence = 1,
            GroupTypeId = groupTypeId
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

        await context.Groups.AddAsync(emergencyFund);
        
        await context.HistoricValues.AddRangeAsync(
            bankAccountHistory
                .Select(value => value.ToComponentValue(bankAccount.Id, bankAccountAllocationId))
                .Concat(cashPlnHistory
                    .Select(value => value.ToComponentValue(cashPln.Id, cashPhysicalAllocationId)))
                .Concat(cashEurHistory
                    .Select(value => value.ToComponentValue(cashEur.Id, cashPhysicalAllocationId, currency: "EUR")))
        );

        await context.HistoricTargets.AddRangeAsync(
            targets
                .Select(target => target.ToHistoricTarget(emergencyFund.Id))
        );
    }
    
    private static async ValueTask SeedLongTermWallet(
        FinanceTrackerContext context, 
        Guid groupTypeId,
        int startYear, 
        DateOnly endDate,
        Guid bankAccountAllocationId)
    {
        var longTermWallet = new Group
        {
            Name = "Long-Term Wallet",
            DisplaySequence = 2,
            GroupTypeId = groupTypeId
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
        
        await context.Groups.AddAsync(longTermWallet);
        
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

    private static async ValueTask SeedAssets(
        FinanceTrackerContext context, 
        int startYear, 
        DateOnly endDate
        )
    {
        var assetsGroupId = context.Groups.Single(group => group.Name == "Assets").Id;
        
        var home = new Component
        {
            Name = "Home",
            DisplaySequence = 1,
            GroupId = assetsGroupId
        };

        var car = new Component
        {
            Name = "Car",
            DisplaySequence = 2,
            GroupId = assetsGroupId
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

        await context.Components.AddRangeAsync(home, car);
        
        await context.HistoricValues.AddRangeAsync(
            homeValueHistory
                .Select(value => value.ToComponentValue(home.Id))
                .Concat(carValueHistory
                    .Select(value => value.ToComponentValue(car.Id)))
        );
    }
    
    private static async ValueTask SeedDebts(
        FinanceTrackerContext context,
        int startYear, 
        DateOnly endDate)
    {
        var debtsGroupId = context.Groups.Single(group => group.Name == "Debts").Id;
        
        var mortgage = new Component
        {
            Name = "Mortgage",
            DisplaySequence = 1,
            GroupId = debtsGroupId
        };

        var carPayment = new Component
        {
            Name = "Car Payment",
            DisplaySequence = 2,
            GroupId = debtsGroupId
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

        await context.Components.AddRangeAsync(mortgage, carPayment);
        
        await context.HistoricValues.AddRangeAsync(
            mortgageHistory
                .Select(value => value.ToComponentValue(mortgage.Id))
                .Concat(carPaymentHistory
                    .Select(value => value.ToComponentValue(carPayment.Id)))
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
        
        public HistoricValue ToComponentValue(Guid componentId, Guid? physicalAllocationId = null, string currency = DefaultCurrency)
            => HistoricValue.CreateComponentValue(Date, ToMoney(Value, currency), componentId, physicalAllocationId);

        public HistoricTarget ToHistoricTarget(Guid groupId) => new()
        {
            GroupId = groupId,
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