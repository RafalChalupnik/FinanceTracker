using FinanceTracker.Core.Queries.DTOs;

namespace FinanceTracker.Core.Queries.Implementation.DTOs;

public record DateRange(
    DateGranularity Granularity,
    DateOnly From,
    DateOnly To,
    string Representation
);