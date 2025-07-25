namespace FinanceTracker.Core;

internal interface IOrderableEntity : IEntity
{
    int DisplaySequence { get; }
}