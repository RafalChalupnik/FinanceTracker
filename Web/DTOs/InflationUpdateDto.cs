namespace FinanceTracker.Web.DTOs;

public record InflationUpdateDto(
    int Year,
    int Month,
    decimal Value
);