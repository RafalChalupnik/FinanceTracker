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
    
    public bool IsEmpty => Amount == 0 && AmountInMainCurrency == 0;

    public Money Plus(Money other, string mainCurrency)
        => Aggregate(other, mainCurrency, (a, b) => a + b);

    public Money Minus(Money other, string mainCurrency) 
        => Aggregate(other, mainCurrency, (a, b) => a - b);

    private Money Aggregate(Money other, string mainCurrency, Func<decimal, decimal, decimal> @operator)
    {
        if (other.IsEmpty)
        {
            return this;
        }

        if (IsEmpty)
        {
            return other;
        }
        
        if (other is { Amount: 0, AmountInMainCurrency: 0 })
        {
            return this;
        }
        
        return other.Currency == Currency
            ? new Money(
                Amount: @operator(Amount, other.Amount),
                Currency: Currency,
                AmountInMainCurrency: @operator(AmountInMainCurrency, other.AmountInMainCurrency)
            )
            : new Money(
                Amount: @operator(AmountInMainCurrency, other.AmountInMainCurrency),
                Currency: mainCurrency,
                AmountInMainCurrency: @operator(AmountInMainCurrency, other.AmountInMainCurrency)
            );
    }
}