using FinanceTracker.Core.Queries.DTOs;

namespace FinanceTracker.Core.Queries.Implementation.DTOs;

public record EntityData(
    Guid? Id,
    string Name,
    IReadOnlyCollection<DateOnly> Dates,
    Func<DateOnly, ValueSnapshotDto?> GetValueForDate
);