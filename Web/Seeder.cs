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
        
        var bankAccount = new Component(name: "Bank Account", displaySequence: 1);
        bankAccount.Evaluate(today, dummyValue);
        
        var cash = new Component(name: "Cash", displaySequence: 2);
        cash.Evaluate(today, dummyValue);
        
        var emergencyFund = new Wallet(name: "Emergency Fund", displaySequence: 1);
        emergencyFund.Add(bankAccount);
        emergencyFund.Add(cash);
        
        var bonds = new Component(name: "Bonds", displaySequence: 1);
        bonds.Evaluate(today, dummyValue);
        
        var stocks = new Component(name: "Stocks", displaySequence: 2);
        stocks.Evaluate(today, dummyValue);
        
        var longTermWallet = new Wallet(name: "Long-Term Wallet", displaySequence: 2);
        longTermWallet.Add(bonds);
        longTermWallet.Add(stocks);
        
        var home = new Asset
        {
            Name = "Home",
            DisplaySequence = 1
        };
        home.Evaluate(today, dummyValue);

        var car = new Asset
        {
            Name = "Car",
            DisplaySequence = 2,
        };
        car.Evaluate(today, dummyValue);

        var mortgage = new Debt
        {
            Name = "Mortgage",
            DisplaySequence = 1
        };
        mortgage.Evaluate(today, dummyValue);

        var carPayment = new Debt
        {
            Name = "Car Payment",
            DisplaySequence = 2
        };
        carPayment.Evaluate(today, dummyValue);

        context.Add(emergencyFund);
        context.Add(longTermWallet);
        context.Add(home);
        context.Add(car);
        context.Add(mortgage);
        context.Add(carPayment);
    }
}