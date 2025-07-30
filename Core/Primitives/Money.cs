using System.ComponentModel.DataAnnotations.Schema;

namespace FinanceTracker.Core.Primitives;

/// <summary>
/// Represents money as a value object - tuple of amount and currency.
/// </summary>

[ComplexType]
public record Money(
    decimal Amount,
    string Currency,
    decimal AmountInMainCurrency
)
{
    public static Money Empty => new(
        Amount: 0, 
        Currency: "PLN", 
        AmountInMainCurrency: 0
    );
}