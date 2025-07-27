namespace FinanceTracker.Core.Interfaces;

internal interface IOrderableEntity : IEntity
{
    int DisplaySequence { get; }
}