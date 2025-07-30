using FinanceTracker.Core.Primitives;

namespace FinanceTracker.Core.Queries.DTOs;

public record EntitiesPerDateQueryDto(
    IReadOnlyCollection<EntityHeaderDto> Headers,
    IReadOnlyCollection<EntitiesForDateDto> Data
);

public record EntityHeaderDto(
    string Name,
    Guid? Id
);

public record EntitiesForDateDto(
    DateOnly Date,
    IReadOnlyCollection<ValueSnapshotDto?> Entities,
    ValueSnapshotDto Summary
);

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

    public static ValueSnapshotDto? CalculateChanges(ValueSnapshotDto? previous, ValueSnapshotDto? current)
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
    public static ValueSnapshotDto? ToValueSnapshotDto(this Money? value) => 
        value != null
            ? new ValueSnapshotDto(value)
            : null;
}