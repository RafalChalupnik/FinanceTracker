namespace FinanceTracker.Core.Interfaces;

public interface IOrderableEntity : INamedEntity
{
    /// <summary>
    /// Display sequence of the entity.
    /// </summary>
    int DisplaySequence { get; set; }
}