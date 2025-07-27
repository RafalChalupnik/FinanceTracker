using System.ComponentModel.DataAnnotations;
using FinanceTracker.Core.Interfaces;

namespace FinanceTracker.Core;

/// <summary>
/// Represents a physical, non-monetary asset.
/// </summary>
public class Asset(string name, int displaySequence) 
    : EntityWithValueHistory, IOrderableEntity, IEntityInPortfolio
{
    [Key]
    public Guid Id { get; init; } = Guid.NewGuid();

    /// <summary>
    /// User-friendly name of the asset.
    /// </summary>
    public string Name => name;
    
    /// <summary>
    /// Sequence in which wallets should be displayed.
    /// </summary>
    public int DisplaySequence => displaySequence;

    /// <summary>
    /// Portfolio to which the asset belongs.
    /// </summary>
    public Guid PortfolioId { get; } = Guid.Empty;
}