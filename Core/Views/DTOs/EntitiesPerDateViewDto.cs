namespace FinanceTracker.Core.Views.DTOs;

public record EntitiesPerDateViewDto(
    IReadOnlyCollection<EntitiesForDateDto> Data
);

public record EntitiesForDateDto(
    DateOnly Date,
    IReadOnlyCollection<ValueSnapshotDto> Entities,
    ValueSnapshotDto Summary
);

public record ValueSnapshotDto(
    string Name,
    decimal Value,
    decimal Change = 0,
    decimal CumulativeChange = 0,
    Guid? Id = null
)
{
    public static ValueSnapshotDto CalculateChanges(ValueSnapshotDto previous, ValueSnapshotDto current)
    {
        var change = current.Value - previous.Value;

        return current with
        {
            Change = change,
            CumulativeChange = change + previous.CumulativeChange
        };
    }
}