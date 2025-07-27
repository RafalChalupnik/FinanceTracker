using FinanceTracker.Core.Extensions;
using FinanceTracker.Core.Interfaces;
using FinanceTracker.Core.Queries.DTOs;

namespace FinanceTracker.Core.Queries.Implementation;

internal static class EntitiesPerDateViewDtoFactory
{
    public enum BaseValueType
    {
        Positive,
        Negative
    }
    
    public static EntitiesPerDateQueryDto BuildEntitiesPerDateViewDto<T>(
        IReadOnlyCollection<T> entities,
        BaseValueType valueType
        ) where T : IEntityWithValueHistory, IOrderableEntity
    {
        var dates = entities
            .SelectMany(entity => entity.GetEvaluationDates())
            .Distinct()
            .OrderBy(date => date)
            .ToArray();

        return new EntitiesPerDateQueryDto(
            Data: dates
                .Select(date => BuildEntitiesForDateDto(
                        date: date,
                        valueSnapshots: entities
                            .OrderBy(entity => entity.DisplaySequence)
                            .Select(entity => new ValueSnapshotDto(
                                Name: entity.Name,
                                Value: GetValueFor(entity, date, valueType),
                                Id: entity.Id
                            ))
                            .ToArray()
                    )
                )
                .ToArray()
                .CalculateChanges()
                .ToArray()
        );
    }

    private static decimal GetValueFor(this IEntityWithValueHistory entity, DateOnly date, BaseValueType valueType)
    {
        var value = Math.Abs(entity.GetValueFor(date) ?? 0);

        return valueType switch
        {
            BaseValueType.Positive => value,
            BaseValueType.Negative => -value,
            _ => throw new NotImplementedException()
        };
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

    private static IEnumerable<EntitiesForDateDto> CalculateChanges(this IReadOnlyList<EntitiesForDateDto> values)
    {
        EntitiesForDateDto[] firstValue = [values[0]];
        return firstValue
            .Concat(values
                .Scan(CalculateChanges))
            .ToArray();
    }

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