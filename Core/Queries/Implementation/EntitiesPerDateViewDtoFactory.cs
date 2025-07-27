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
                        entityValues: entities
                            .OrderBy(entity => entity.DisplaySequence)
                            .Select(entity => new EntityValueDto(
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

    private static ValueSnapshotDto? GetValueFor(this IEntityWithValueHistory entity, DateOnly date, BaseValueType valueType)
    {
        var decimalValue = entity.GetValueFor(date);

        return decimalValue.HasValue
            ? new ValueSnapshotDto(
                Value: valueType switch
                {
                    BaseValueType.Positive => Math.Abs(decimalValue.Value),
                    BaseValueType.Negative => -Math.Abs(decimalValue.Value),
                    _ => throw new NotImplementedException()
                })
            : null;
    }
    
    private static EntitiesForDateDto BuildEntitiesForDateDto(
        DateOnly date,
        IReadOnlyCollection<EntityValueDto> entityValues) =>
        new(
            Date: date,
            Entities: entityValues,
            Summary: new EntityValueDto(
                Name: "Summary",
                Value: new ValueSnapshotDto(
                    Value: entityValues.Sum(entity => entity.Value?.Value ?? 0)
                )
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
        var entities = previous.Entities
            .Zip(current.Entities)
            .Select(pair => pair.Second with
            {
                Value = ValueSnapshotDto.CalculateChanges(pair.First.Value, pair.Second.Value)
            })
            .ToArray();
        
        var changeSum = entities.Sum(x => x.Value?.Change ?? 0);

        var summary = current.Summary.Value != null
            ? current.Summary.Value with
            {
                Change = changeSum,
                CumulativeChange = changeSum + (previous.Summary.Value?.CumulativeChange ?? 0)
            }
            : null;
        
        return current with
        {
            Entities = entities,
            Summary = current.Summary with
            {
                Value = summary
            }
        };
    }
}