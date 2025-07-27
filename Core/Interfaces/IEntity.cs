namespace FinanceTracker.Core.Interfaces;

public interface IEntity
{
    Guid Id { get; }
    
    string Name { get; }
}