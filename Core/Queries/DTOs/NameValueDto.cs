using FinanceTracker.Core.Primitives;

namespace FinanceTracker.Core.Queries.DTOs;

public record NameValueDto(
    string Name,
    Money Value
);