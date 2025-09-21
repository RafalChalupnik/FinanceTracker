using FinanceTracker.Core.Primitives;

namespace FinanceTracker.Core.Interfaces;

internal interface IEntityWithValueHistory
{
    IEnumerable<DateOnly> GetEvaluationDates();
    
    MoneyValue? GetValueFor(DateOnly date);
}
