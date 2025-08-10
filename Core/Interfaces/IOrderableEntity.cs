namespace FinanceTracker.Core.Interfaces;

public interface IOrderableEntity : INamedEntity
{
    int DisplaySequence { get; set; }
}