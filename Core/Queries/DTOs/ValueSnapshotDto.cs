using FinanceTracker.Core.Primitives;

namespace FinanceTracker.Core.Queries.DTOs;

public record EntityValueSnapshotDto(
    Money Value,
    bool Inferred,
    Guid? PhysicalAllocationId,
    Money? Change = null,
    Money? CumulativeChange = null
) : ValueSnapshotDto(Value, Change, CumulativeChange);

public record ValueSnapshotDto
{
    public Money Value { get; init; }
    public Money Change { get; init; }
    public Money CumulativeChange { get; init; }
    
    public ValueSnapshotDto(
        Money value,
        Money? change = null,
        Money? cumulativeChange = null)
    {
        Value = value;
        Change = change ?? Money.Empty with {Currency = value.Currency};
        CumulativeChange = cumulativeChange ?? Money.Empty with {Currency = value.Currency};
    }

    public static T? CalculateChanges<T>(T? previous, T? current) where T : ValueSnapshotDto
    {
        if (previous == null && current == null)
        {
            return null;
        }

        if (previous == null)
        {
            return current;
        }

        var change = current!.Value.Minus(previous.Value, mainCurrency: "PLN");

        return current with
        {
            Change = change,
            CumulativeChange = change.Plus(previous.CumulativeChange, mainCurrency: "PLN")
        };
    }
}

public static class ValueSnapshotDtoExtensions
{
    public static EntityValueSnapshotDto? ToEntityValueSnapshotDto(this Money? value) => 
        value != null
            ? new EntityValueSnapshotDto(value, Inferred: true, null)
            : null;
    
    public static EntityValueSnapshotDto? ToEntityValueSnapshotDto(this MoneyValue? value) => 
        value != null
            ? new EntityValueSnapshotDto(value.Value, Inferred: !value.ExactDate, value.PhysicalAllocationId)
            : null;
}