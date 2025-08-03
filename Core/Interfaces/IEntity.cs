namespace FinanceTracker.Core.Interfaces;

public interface IEntity
{
    Guid Id { get; init; }
    
    string Name { get; set; }
}