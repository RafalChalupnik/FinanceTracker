namespace FinanceTracker.Core.Interfaces;

public interface IEntityInPortfolio : IEntity
{
    Guid PortfolioId { get; }
}