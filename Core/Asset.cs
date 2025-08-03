using System.ComponentModel.DataAnnotations;
using FinanceTracker.Core.Interfaces;

namespace FinanceTracker.Core;

/// <summary>
/// Represents a physical, non-monetary asset.
/// </summary>
public class Asset : EntityWithValueHistory, IOrderableEntity
{
    [Key]
    public Guid Id { get; init; } = Guid.NewGuid();

    /// <summary>
    /// User-friendly name of the asset.
    /// </summary>
    public string Name { get; set; } = string.Empty;

    /// <summary>
    /// Sequence in which assets should be displayed.
    /// </summary>
    public int DisplaySequence { get; set; }
}