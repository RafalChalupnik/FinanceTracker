using FinanceTracker.Core.Extensions;
using FinanceTracker.Core.Interfaces;
using FinanceTracker.Core.Queries.DTOs;

namespace FinanceTracker.Core.Queries.Implementation;

internal static class EntitiesPerDateViewDtoFactory
{
    public static EntitiesPerDateQueryDto BuildEntitiesPerDateViewDto<T>(
        IQueryable<T> entities,
        BaseValueType valueType
    ) where T : IEntityWithValueHistory, IOrderableEntity
    {
        var mappedEntities = entities
            .OrderBy(x => x.DisplaySequence)
            .AsEnumerable()
            .Select(entity => new EntityData(
                    Name: entity.Name,
                    Dates: entity.GetEvaluationDates().ToArray(),
                    GetValueForDate: date => entity.GetValueFor(date, valueType),
                    Id: entity.Id
                )
            )
            .ToArray();
        
        return BuildEntitiesPerDateViewDto(mappedEntities);
    }
    
    public static EntitiesPerDateQueryDto BuildEntitiesPerDateViewDto<T>(
        IReadOnlyList<T> orderedEntities,
        BaseValueType valueType
        ) where T : IEntityWithValueHistory, IEntity
    {
        var mappedEntities = orderedEntities
            .Select(entity => new EntityData(
                    Name: entity.Name,
                    Dates: entity.GetEvaluationDates().ToArray(),
                    GetValueForDate: date => entity.GetValueFor(date, valueType),
                    Id: entity.Id
                )
            )
            .ToArray();
        
        return BuildEntitiesPerDateViewDto(mappedEntities);
    }
    
    public static EntitiesPerDateQueryDto BuildEntitiesPerDateViewDto(IReadOnlyList<EntityData> orderedEntities)
    {
        var dates = orderedEntities
            .SelectMany(entity => entity.Dates)
            .Distinct()
            .OrderBy(date => date)
            .ToArray();

        return new EntitiesPerDateQueryDto(
            Headers: orderedEntities
                .Select(entity => new EntityHeaderDto(
                        Name: entity.Name,
                        Id: entity.Id
                    )
                )
                .ToArray(),
            Data: dates
                .Select(date => BuildEntitiesForDateDto(
                        date: date,
                        entityValues: orderedEntities
                            .Select(entity => entity.GetValueForDate(date))
                            .ToArray()
                    )
                )
                .ToArray()
                .CalculateChanges()
                .ToArray()
        );
    }
    
    public static ValueSnapshotDto? GetValueFor(this IEntityWithValueHistory entity, DateOnly date, BaseValueType valueType)
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
        IReadOnlyCollection<ValueSnapshotDto?> entityValues) =>
        new(
            Date: date,
            Entities: entityValues,
            Summary: new ValueSnapshotDto(
                Value: entityValues.Sum(entity => entity?.Value ?? 0)
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
            .Select(pair => ValueSnapshotDto.CalculateChanges(pair.First, pair.Second))
            .ToArray();
        
        var changeSum = entities.Sum(x => x?.Change ?? 0);

        return current with
        {
            Entities = entities,
            Summary = current.Summary with
            {
                Change = changeSum,
                CumulativeChange = changeSum + previous.Summary.CumulativeChange
            }
        };
    }
    
    public record EntityData(
        string Name,
        IReadOnlyCollection<DateOnly> Dates,
        Func<DateOnly, ValueSnapshotDto?> GetValueForDate,
        Guid? Id = null
    );
    
    public enum BaseValueType
    {
        Positive,
        Negative
    }
}