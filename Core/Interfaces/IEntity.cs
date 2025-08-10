namespace FinanceTracker.Core.Interfaces;

public interface IEntity
{
    Guid Id { get; init; }
}

public interface INamedEntity : IEntity
{
    string Name { get; set; }
}