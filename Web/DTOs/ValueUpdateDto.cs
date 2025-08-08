using FinanceTracker.Core.Primitives;

namespace FinanceTracker.Web.DTOs;

public record MoneyUpdateDto(
    DateOnly Date,
    Money Value
);