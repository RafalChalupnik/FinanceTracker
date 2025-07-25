namespace FinanceTracker.Core;

public interface IEntityInPortfolio : IEntity
{
    Guid PortfolioId { get; }
}