using FinanceTracker.Core.Entities;
using FinanceTracker.Core.Extensions;
using FinanceTracker.Core.Primitives;
using FinanceTracker.Core.Queries.DTOs;

namespace FinanceTracker.Core.Queries.Implementation.DTOs;

public record EntityData(
    Guid? Id,
    string Name,
    string? ParentName,
    Guid? DefaultPhysicalAllocationId,
    IReadOnlyCollection<DateOnly> Dates,
    Func<DateOnly, EntityValueSnapshotDto?> GetValueForDate
)
{
    public static EntityData FromComponent(Component component) =>
        new(
            Id: component.Id,
            Name: component.Name,
            ParentName: component.Group?.Name,
            DefaultPhysicalAllocationId: component.DefaultPhysicalAllocationId,
            Dates: component.GetEvaluationDates().ToArray(),
            GetValueForDate: date => component.GetValueFor(date).ToEntityValueSnapshotDto()
        );

    public static EntityData FromComponentValues(
        Component component, 
        IEnumerable<HistoricValue> values,
        Guid physicalAllocationId
        )
    {
        var orderedValues = values
            .OrderByDescending(x => x.Date)
            .ToArray();

        return new EntityData(
            Id: component.Id,
            Name: component.Name,
            ParentName: component.Group?.Name,
            DefaultPhysicalAllocationId: component.DefaultPhysicalAllocationId,
            Dates: orderedValues.Select(x => x.Date).Distinct().ToArray(),
            GetValueForDate: date =>
            {
                // TODO: Make an extension method from EntityWithValueHistory

                var historicValue = orderedValues
                    .FirstOrDefault(x => x.Date <= date);
                // .Value;

                if (historicValue == null)
                {
                    return null;
                }

                return new MoneyValue(
                    Value: historicValue.Value,
                    ExactDate: historicValue.Date == date,
                    PhysicalAllocationId: physicalAllocationId
                ).ToEntityValueSnapshotDto();
            }
        );
    }
    
    public static EntityData FromGroup(Group group) =>
        new(
            Id: group.Id,
            Name: group.Name,
            ParentName: null,
            DefaultPhysicalAllocationId: null,
            Dates: group.GetEvaluationDates().ToArray(),
            GetValueForDate: date => group.GetValueFor(date).ToEntityValueSnapshotDto()
        );

    public static EntityData FromGroups(string name, IReadOnlyCollection<Group> groups)
    {
        var dates = groups
            .SelectMany(date => date.GetEvaluationDates())
            .ToArray();
        
        return new EntityData(
            Id: null,
            Name: name,
            ParentName: null,
            Dates: dates,
            DefaultPhysicalAllocationId: null,
            GetValueForDate: date => groups
                .Select(entity => entity.GetValueFor(date))
                .WhereNotNull()
                .Select(moneyValue => moneyValue.Value)
                .ToArray()
                .Sum(mainCurrency: "PLN")
                .ToEntityValueSnapshotDto()
        );
    }
}