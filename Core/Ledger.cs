namespace FinanceTracker.Core;

public record Ledger
{
    private readonly List<Transaction> _transactions;

    public Ledger(IEnumerable<Transaction> source)
    {
        _transactions = source.ToList();
    }
    
    public IReadOnlyList<Transaction> Transactions => _transactions
        .OrderBy(transaction => transaction.Date)
        .ToArray();
}

public record Transaction(
    DateOnly Date,
    Allocation? From,
    Allocation? To);
    
public record Allocation(
    LogicalWallet Logical,
    PhysicalWallet Physical,
    decimal Amount
    );