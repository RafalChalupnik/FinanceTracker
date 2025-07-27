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

public record ValueSnapshotDto(
    decimal Value,
    decimal Change = 0,
    decimal CumulativeChange = 0
)
{
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
        
        var change = current.Value - previous.Value;

        return current with
        {
            Change = change,
            CumulativeChange = change + previous.CumulativeChange
        };
    }
}