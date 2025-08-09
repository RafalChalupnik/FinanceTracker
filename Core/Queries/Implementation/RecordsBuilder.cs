using FinanceTracker.Core.Extensions;
using FinanceTracker.Core.Interfaces;
using FinanceTracker.Core.Primitives;
using FinanceTracker.Core.Queries.DTOs;
using FinanceTracker.Core.Queries.Implementation.DTOs;

namespace FinanceTracker.Core.Queries.Implementation;

internal static class RecordsBuilder
{
    public static ValueRecord[] BuildValueRecords(
        IReadOnlyList<EntityData> orderedEntities,
        DateGranularity? dateGranularity,
        DateOnly? fromDate = null,
        DateOnly? toDate = null
        )
    {
        var dateRanges = orderedEntities
            .SelectMany(entity => entity.Dates)
            .Where(date => date >= (fromDate ?? DateOnly.MinValue))
            .Where(date => date <= (toDate ?? DateOnly.MaxValue))
            .GroupDates(dateGranularity ?? DateGranularity.Date);

        return dateRanges
            .Select(dateRange => BuildValueRecord(dateRange, orderedEntities))
            .ToArray()
            .CalculateChanges();
    }

    private static ValueRecord BuildValueRecord(
        DateRange dateRange,
        IReadOnlyList<EntityData> orderedEntities)
    {
        var entitiesValues = orderedEntities
            .Select(entity => entity.GetValueForDate(dateRange.To))
            .ToArray();

        return new ValueRecord(
            DateRange: dateRange,
            Entities: orderedEntities
                .Select(entity => entity.GetValueForDate(dateRange.To))
                .ToArray(),
            Summary: new ValueSnapshotDto(
                value: entitiesValues
                    .WhereNotNull()
                    .Select(entity => entity.Value)
                    .ToArray()
                    .Sum(mainCurrency: "PLN") ?? Money.Empty
            )
        );
    }
    
    private static ValueRecord[] CalculateChanges(this ValueRecord[] values)
    {
        if (values.Length < 2)
        {
            return values;
        }
        
        ValueRecord[] firstValue = [values[0]];
        return firstValue
            .Concat(values
                .Scan(CalculateChanges))
            .ToArray();
    }
    
    private static ValueRecord CalculateChanges(ValueRecord previous, ValueRecord current)
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
}