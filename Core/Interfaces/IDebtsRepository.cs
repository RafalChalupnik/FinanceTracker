namespace FinanceTracker.Core.Interfaces;

public interface IDebtsRepository
{
    IQueryable<Debt> GetDebts(Guid portfolioId);
}