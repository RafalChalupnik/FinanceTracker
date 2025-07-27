namespace FinanceTracker.Core.Queries.DTOs;

public record EntitiesPerDateQueryDto(
    IReadOnlyCollection<EntitiesForDateDto> Data
);

public record EntitiesForDateDto(
    DateOnly Date,
    IReadOnlyCollection<EntityValueDto> Entities,
    EntityValueDto Summary
);

public record EntityValueDto(
    string Name,
    ValueSnapshotDto? Value,
    Guid? Id = null
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