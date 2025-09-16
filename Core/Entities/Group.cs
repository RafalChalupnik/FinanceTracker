using FinanceTracker.Core.Interfaces;

namespace FinanceTracker.Core.Entities;

public class Group : IOrderableEntity
{
    private readonly List<Component> _components = [];
    
    /// <inheritdoc />
    public Guid Id { get; init; } = Guid.NewGuid();
    
    /// <inheritdoc />
    public required string Name { get; set; }
    
    /// <inheritdoc />
    public int DisplaySequence { get; set; }
    
    /// <summary>
    /// <see cref="GroupType"/> to which the <see cref="Group"/> belongs.
    /// </summary>
    public GroupType? GroupType { get; set; }
    
    /// ID of the <see cref="GroupType"/> to which the <see cref="Group"/> belongs.
    public Guid GroupTypeId { get; set; }
    
    /// <summary>
    /// Components of the <see cref="Group"/>.
    /// </summary>
    public IReadOnlyList<Component> Components => _components;
}