using FinanceTracker.Core.Queries.DTOs;

namespace FinanceTracker.Core.Repositories;

public class GroupTypeRepository(FinanceTrackerContext dbContext)
{
    public IReadOnlyCollection<OrderableEntityDto> GetGroupTypes()
    {
        return dbContext.GroupTypes
            .OrderBy(x => x.DisplaySequence)
            .AsEnumerable()
            .Select(OrderableEntityDto.FromEntity)
            .ToArray();
    }
}