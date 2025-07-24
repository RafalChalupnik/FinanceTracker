namespace FinanceTracker.Core.Interfaces;

public interface IAssetsRepository
{
    IQueryable<Asset> GetAssets(Guid portfolioId);
}