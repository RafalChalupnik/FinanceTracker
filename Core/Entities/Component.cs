using System.ComponentModel.DataAnnotations;
using FinanceTracker.Core.Interfaces;

namespace FinanceTracker.Core.Entities;

public class Component : EntityWithValueHistory, IOrderableEntity
{
    [Key]
    public Guid Id { get; init; } = Guid.NewGuid();
    
    public Guid? DefaultPhysicalAllocationId { get; set; }

    /// <summary>
    /// User-friendly name of the wallet component.
    /// </summary>
    public string Name { get; set; } = string.Empty;
    
    /// <summary>
    /// Sequence in which wallets should be displayed.
    /// </summary>
    public int DisplaySequence { get; set; }
    
    /// <summary>
    /// ID of the wallet the component is part of.
    /// </summary>
    public Guid? WalletId { get; init; }
    
    /// <summary>
    /// Wallet the component is part of.
    /// </summary>
    public Wallet? Wallet { get; init; }
    
    /// <summary>
    /// ID of the <see cref="Group"/> the <see cref="Component"/> is part of.
    /// </summary>
    public Guid GroupId { get; init; }
    
    /// <summary>
    /// <see cref="Group"/> the <see cref="Component"/> is part of.
    /// </summary>
    public Group? Group { get; init; }
}