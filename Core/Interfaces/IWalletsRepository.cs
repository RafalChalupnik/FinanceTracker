namespace FinanceTracker.Core.Interfaces;

public interface IWalletsRepository
{
    IQueryable<Wallet> GetWallets(Guid portfolioId);
}