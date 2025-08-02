namespace FinanceTracker.Core.Interfaces;

public interface IOrderableEntity : IEntity
{
    int DisplaySequence { get; }
}