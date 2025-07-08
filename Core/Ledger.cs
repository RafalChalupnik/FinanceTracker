namespace FinanceTracker.Core;

public record Ledger
{
    private readonly List<Transaction> _transactions = new();

    public IReadOnlyList<Transaction> Transactions => _transactions
        .OrderBy(transaction => transaction.Date)
        .ToArray();
    
    public void Add(Transaction transaction)
        => _transactions.Add(transaction);
    
    public void AddRange(IEnumerable<Transaction> transactions)
        => _transactions.AddRange(transactions);
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