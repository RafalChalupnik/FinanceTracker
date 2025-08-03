using FinanceTracker.Core;
using FinanceTracker.Core.Primitives;

namespace FinanceTracker.Web;

internal static class Seeder
{
    public static async ValueTask SeedDataIfNecessary(FinanceTrackerContext context)
    {
        if (context.Assets.Any() == false && context.Debts.Any() == false && context.Wallets.Any() == false)
        {
            AddTestPortfolio(context);
            await context.SaveChangesAsync();
        }
    }
    
    private static void AddTestPortfolio(FinanceTrackerContext context)
    {
        var today = DateOnly.FromDateTime(DateTime.Now);
        var dummyValue = new Money(100, "PLN", 100);

        var bankAccount = new Component
        {
            Name = "Bank Account",
            DisplaySequence = 1,
        };
        bankAccount.SetValue(today, dummyValue);
        
        var cash = new Component
        {
            Name = "Cash",
            DisplaySequence = 2,
        };
        cash.SetValue(today, dummyValue);
        
        var emergencyFund = new Wallet(name: "Emergency Fund", displaySequence: 1);
        emergencyFund.Add(bankAccount);
        emergencyFund.Add(cash);
        
        var bonds = new Component
        {
            Name = "Bonds",
            DisplaySequence = 1,
        };
        bonds.SetValue(today, dummyValue);
        
        var stocks = new Component
        {
            Name = "Stocks",
            DisplaySequence = 2,       
        };
        stocks.SetValue(today, dummyValue);
        
        var longTermWallet = new Wallet(name: "Long-Term Wallet", displaySequence: 2);
        longTermWallet.Add(bonds);
        longTermWallet.Add(stocks);
        
        var home = new Asset
        {
            Name = "Home",
            DisplaySequence = 1
        };
        home.SetValue(today, dummyValue);

        var car = new Asset
        {
            Name = "Car",
            DisplaySequence = 2,
        };
        car.SetValue(today, dummyValue);

        var mortgage = new Debt
        {
            Name = "Mortgage",
            DisplaySequence = 1
        };
        mortgage.SetValue(today, dummyValue);

        var carPayment = new Debt
        {
            Name = "Car Payment",
            DisplaySequence = 2
        };
        carPayment.SetValue(today, dummyValue);

        context.Add(emergencyFund);
        context.Add(longTermWallet);
        context.Add(home);
        context.Add(car);
        context.Add(mortgage);
        context.Add(carPayment);
    }
}