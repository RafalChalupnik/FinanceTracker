namespace FinanceTracker.Web.DTOs;

public record ValueUpdateDto(
    DateOnly Date,
    decimal Value
);