namespace FinanceTracker.Web.DTOs;

public record DebtsDto(
    IReadOnlyCollection<DebtDataDto> Data
);

public record DebtDataDto(
    DateOnly Date,
    IReadOnlyCollection<ValueSnapshotDto> Debts,
    ValueSnapshotDto Summary
);