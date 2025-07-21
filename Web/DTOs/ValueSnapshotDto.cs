namespace FinanceTracker.Web.DTOs;

public record ValueSnapshotDto(
    string Name,
    decimal Value,
    decimal Change = 0,
    decimal CumulativeChange = 0
);
