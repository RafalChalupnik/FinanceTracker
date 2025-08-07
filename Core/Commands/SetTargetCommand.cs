using FinanceTracker.Core.Interfaces;

namespace FinanceTracker.Core.Commands;

public class SetTargetCommand(IRepository repository)
{
    public async ValueTask SetTarget(Guid walletId, DateOnly date, decimal value)
    {
        var wallet = repository.GetWallets(includeValueHistory: false, includeTargets: true)
            .First(wallet => wallet.Id == walletId);
        
        var newValue = wallet.SetTarget(date, value);

        if (newValue != null)
        {
            repository.Add(newValue);
        }

        await repository.SaveChangesAsync();
    }
}