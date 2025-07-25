namespace FinanceTracker.Core;

public interface IEntity
{
    Guid Id { get; }
    
    string Name { get; }
}