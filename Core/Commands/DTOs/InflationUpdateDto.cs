namespace FinanceTracker.Core.Commands.DTOs;

public record InflationUpdateDto(
    int Year,
    int Month,
    decimal Value,
    bool Confirmed
);