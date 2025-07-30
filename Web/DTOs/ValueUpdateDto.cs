using FinanceTracker.Core.Primitives;

namespace FinanceTracker.Web.DTOs;

public record ValueUpdateDto(
    DateOnly Date,
    Money Value
);