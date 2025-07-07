namespace FinanceTracker.Core;

/// <summary>
/// Represent a real, physical wallet - cash, account, fund, etc.
/// </summary>
/// <param name="Name">User-friendly name of the wallet.</param>
/// <param name="Currency">Currency of the wallet.</param>
public record PhysicalWallet(
    string Name,
    string Currency
    );