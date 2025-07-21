namespace FinanceTracker.Web.DTOs;

public record WalletsSummaryDto(
    IReadOnlyCollection<DateSummaryDto> Data
);

public record DateSummaryDto(
    DateOnly Date,
    IReadOnlyCollection<ValueSnapshotDto> Wallets,
    ValueSnapshotDto Summary
    );

public record ValueSnapshotDto(
    string Name,
    decimal Value,
    decimal Change = 0,
    decimal CumulativeChange = 0
);
