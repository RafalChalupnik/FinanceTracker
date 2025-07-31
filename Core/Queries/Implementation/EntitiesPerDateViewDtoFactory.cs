using FinanceTracker.Core.Extensions;
using FinanceTracker.Core.Interfaces;
using FinanceTracker.Core.Primitives;
using FinanceTracker.Core.Queries.DTOs;

namespace FinanceTracker.Core.Queries.Implementation;

internal static class EntitiesPerDateViewDtoFactory
{
    public static EntitiesPerDateQueryDto BuildEntitiesPerDateViewDto<T>(
        IEnumerable<T> entities
    ) where T : IEntityWithValueHistory, IOrderableEntity
    {
        var mappedEntities = entities
            .OrderBy(x => x.DisplaySequence)
            .Select(entity => new EntityData(
                    Name: entity.Name,
                    Dates: entity.GetEvaluationDates().ToArray(),
                    GetValueForDate: date => entity.GetValueFor(date).ToValueSnapshotDto(),
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
    
    private static EntitiesForDateDto BuildEntitiesForDateDto(
        DateOnly date,
        IReadOnlyCollection<ValueSnapshotDto?> entityValues) =>
        new(
            Date: date,
            Entities: entityValues,
            Summary: new ValueSnapshotDto(
                value: entityValues
                    .WhereNotNull()
                    .Select(entity => entity.Value)
                    .ToArray()
                    .Sum(mainCurrency: "PLN") ?? Money.Empty
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
        
        var changeSum = entities
            .WhereNotNull()
            .Select(entity => entity.Change)
            .ToArray()
            .Sum(mainCurrency: "PLN") ?? Money.Empty;

        return current with
        {
            Entities = entities,
            Summary = current.Summary with
            {
                Change = changeSum,
                CumulativeChange = changeSum.Plus(previous.Summary.CumulativeChange, mainCurrency: "PLN")
            }
        };
    }
    
    public record EntityData(
        string Name,
        IReadOnlyCollection<DateOnly> Dates,
        Func<DateOnly, ValueSnapshotDto?> GetValueForDate,
        Guid? Id = null
    );
}