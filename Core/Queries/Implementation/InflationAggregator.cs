using FinanceTracker.Core.Entities;
using FinanceTracker.Core.Queries.DTOs;
using FinanceTracker.Core.Queries.Implementation.DTOs;

namespace FinanceTracker.Core.Queries.Implementation;

internal static class InflationAggregator
{
    public static InflationDto? AggregateInflation(
        IEnumerable<InflationHistoricValue> inflationValues,
        DateRange dateRange)
    {
        var inflationPoints = inflationValues
            .Where(dataPoint => dataPoint.FitsInRange(dateRange.From, dateRange.To))
            .OrderBy(dataPoint => dataPoint.Year)
            .ThenBy(dataPoint => dataPoint.Month)
            .ToArray();
        
        if (inflationPoints.Length == 0)
        {
            return null;
        }
        
        var inflation = inflationPoints.Aggregate(1m, (a, b) => a * (1 + b.Value));

        return new InflationDto(
            Value: decimal.Round((inflation - 1) * 100, decimals: 2),
            Confirmed: inflationPoints.All(dataPoint => dataPoint.Confirmed)
        );
    }
}