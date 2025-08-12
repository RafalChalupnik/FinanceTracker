using FinanceTracker.Core.Queries.DTOs;
using FinanceTracker.Core.Queries.Implementation.DTOs;

namespace FinanceTracker.Core.Queries.Implementation;

internal static class EntityTableDtoBuilder
{
    public static EntityTableDto<T> BuildEntityTableDto<T>(
        IReadOnlyList<EntityData> orderedEntities,
        T[] rows
        ) where T : ValueHistoryRecordDto
    {
        return new EntityTableDto<T>(
            Columns: orderedEntities
                .Select(entity => new EntityColumnDto(
                    Name: entity.Name,
                    Id: entity.Id,
                    DefaultPhysicalAllocationId: entity.DefaultPhysicalAllocationId
                    )
                )
                .ToArray(),
            Rows: rows
        );
    }
}