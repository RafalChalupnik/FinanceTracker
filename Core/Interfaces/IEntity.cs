namespace FinanceTracker.Core.Interfaces;

public interface IEntity
{
    /// <summary>
    /// ID of the entity.
    /// </summary>
    Guid Id { get; init; }
}

public interface INamedEntity : IEntity
{
    /// <summary>
    /// Name of the entity.
    /// </summary>
    string Name { get; set; }
}