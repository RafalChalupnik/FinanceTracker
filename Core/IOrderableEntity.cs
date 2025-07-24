namespace FinanceTracker.Core;

internal interface IOrderableEntity
{
    Guid Id { get; }
    
    string Name { get; }
    
    int DisplaySequence { get; }
}