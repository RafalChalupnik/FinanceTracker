using Microsoft.EntityFrameworkCore;

namespace FinanceTracker.Core.Commands;

public class SetTargetCommand(FinanceTrackerContext dbContext)
{
    public async ValueTask SetTarget(Guid walletId, DateOnly date, decimal value)
    {
        var wallet = dbContext.Wallets
            .Include(x => x.Targets)
            .First(wallet => wallet.Id == walletId);
        
        var newValue = wallet.SetTarget(date, value);

        if (newValue != null)
        {
            dbContext.WalletTargets.Add(newValue);
        }

        await dbContext.SaveChangesAsync();
    }
}