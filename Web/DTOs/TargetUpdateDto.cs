namespace FinanceTracker.Web.DTOs;

public record TargetUpdateDto(
    DateOnly Date,
    decimal TargetInMainCurrency
);