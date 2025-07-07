namespace FinanceTracker.Core;

/// <summary>
/// Represents a logical wallet - a wallet that does not exist in the real world,
/// but is rather a "fund" that can be allocated in different physical wallets.
/// </summary>
/// <param name="Name">User-friendly name of the wallet.</param>
/// <param name="Value">Current value of the wallet.</param>
/// <param name="Target">Target value of the wallet. Null if unspecified.</param>
public record LogicalWallet(
    string Name,
    Money Value,
    Money? Target = null
    );