using FinanceTracker.Core.Extensions;
using FinanceTracker.Core.Views.DTOs;

namespace FinanceTracker.Core.Views.Implementation;

internal static class EntitiesPerDateViewDtoFactory
{
    public static EntitiesPerDateViewDto BuildEntitiesPerDateViewDto<T>(
        IReadOnlyCollection<T> entities
        ) where T : IEntityWithValueHistory, IOrderableEntity
    {
        var dates = entities
            .SelectMany(entity => entity.GetEvaluationDates())
            .Distinct()
            .OrderBy(date => date)
            .ToArray();

        return new EntitiesPerDateViewDto(
            Data: dates
                .Select(date => BuildEntitiesForDateDto(
                        date: date,
                        valueSnapshots: entities
                            .OrderBy(entity => entity.DisplaySequence)
                            .Select(entity => new ValueSnapshotDto(
                                Name: entity.Name,
                                Value: entity.GetValueFor(date) ?? 0,
                                Id: entity.Id
                            ))
                            .ToArray()
                    )
                )
                .ToArray()
                .Scan(CalculateChanges)
                .ToArray()
        );
    }
    
    private static EntitiesForDateDto BuildEntitiesForDateDto(
        DateOnly date,
        IReadOnlyCollection<ValueSnapshotDto> valueSnapshots) =>
        new(
            Date: date,
            Entities: valueSnapshots,
            Summary: new ValueSnapshotDto(
                Name: "Summary",
                Value: valueSnapshots.Sum(entity => entity.Value)
            )
        );

    private static EntitiesForDateDto CalculateChanges(EntitiesForDateDto previous, EntitiesForDateDto current)
    {
        return current with
        {
            Entities = previous.Entities
                .Zip(current.Entities)
                .Select(pair => ValueSnapshotDto.CalculateChanges(pair.First, pair.Second))
                .ToArray(),
            Summary = ValueSnapshotDto.CalculateChanges(previous.Summary, current.Summary)
        };
    }
}