using FinanceTracker.Core.Queries.DTOs;
using FinanceTracker.Core.Queries.Implementation.DTOs;

namespace FinanceTracker.Core.Queries.Implementation;

internal static class EntityTableDtoBuilder
{
    public static EntityTableDto BuildEntityTableDto(
        IReadOnlyList<EntityData> orderedEntities,
        IReadOnlyCollection<ValueHistoryRecordDto> rows
        )
    {
        return new EntityTableDto(
            Columns: orderedEntities
                .Select(entity => new EntityColumnDto(
                    Id: entity.Id ?? Guid.Empty,
                    Name: entity.Name,
                    ParentName: entity.ParentName,
                    DefaultPhysicalAllocationId: entity.DefaultPhysicalAllocationId
                    )
                )
                .ToArray(),
            Rows: rows
        );
    }
}