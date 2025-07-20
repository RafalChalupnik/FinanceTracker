using FinanceTracker.Core.Primitives;

namespace FinanceTracker.Core;

/// <summary>
/// Represents a wallet, consisting of <see cref="Component"/>.
/// </summary>
/// <param name="Name">User-friendly name of the wallet.</param>
/// <param name="Components">Components of the wallet.</param>
/// <param name="Target">Target value of the wallet - null if not specified.</param>
public record Wallet(
    string Name,
    List<Component> Components,
    Money? Target = null
    );
    
public record Component(
    string Name,
    string Currency,
    Dictionary<DateOnly, decimal> ValueHistory
    );