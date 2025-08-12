using FinanceTracker.Core.Queries.DTOs;

namespace FinanceTracker.Core.Queries.Implementation.DTOs;

public record EntityData(
    Guid? Id,
    string Name,
    string? ParentName,
    Guid? DefaultPhysicalAllocationId,
    IReadOnlyCollection<DateOnly> Dates,
    Func<DateOnly, EntityValueSnapshotDto?> GetValueForDate
);