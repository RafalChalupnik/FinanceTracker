using System.ComponentModel.DataAnnotations;
using FinanceTracker.Core.Entities;
using FinanceTracker.Core.Interfaces;

namespace FinanceTracker.Core;

/// <summary>
/// Represents a wallet, consisting of <see cref="Component"/>.
/// </summary>
public class Wallet : IOrderableEntity
{
    [Key]
    public Guid Id { get; init; } = Guid.NewGuid();

    /// <summary>
    /// User-friendly name of the wallet.
    /// </summary>
    public string Name { get; set; } = string.Empty;
    
    /// <summary>
    /// Sequence in which wallets should be displayed.
    /// </summary>
    public int DisplaySequence { get; set; }
}
