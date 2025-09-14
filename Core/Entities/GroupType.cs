using FinanceTracker.Core.Interfaces;
using FinanceTracker.Core.Queries.DTOs;

namespace FinanceTracker.Core.Entities;

public class GroupType : IOrderableEntity
{
    /// <inheritdoc />
    public Guid Id { get; init; } = Guid.NewGuid();
    
    /// <inheritdoc />
    public required string Name { get; set; }
    
    /// <inheritdoc />
    public int DisplaySequence { get; set; }
    
    /// <summary>
    /// <see cref="Group"/>s that belong to this <see cref="GroupType"/>.
    /// </summary>
    public IReadOnlyCollection<Group> Groups { get; set; } = new List<Group>();
}

public static class GroupTypeExtensions
{
    public static GroupType ToGroupType(this OrderableEntityDto dto) =>
        new()
        {
            Id = dto.Key,
            Name = dto.Name,
            DisplaySequence = dto.DisplaySequence
        };
}