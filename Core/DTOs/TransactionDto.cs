using FinanceTracker.Core.Primitives;

namespace FinanceTracker.Core.DTOs;

public record TransactionDto(
    Guid Key,
    DateOnly Date,
    LedgerEntryDto? Debit,
    LedgerEntryDto? Credit
);

public record LedgerEntryDto(
    Guid ComponentId,
    Money Value,
    Guid? PhysicalAllocationId
);