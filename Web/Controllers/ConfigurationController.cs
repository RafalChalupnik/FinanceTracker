using FinanceTracker.Core;
using FinanceTracker.Core.Entities;
using FinanceTracker.Core.Queries;
using FinanceTracker.Core.Queries.DTOs;
using FinanceTracker.Core.Repositories;
using Microsoft.AspNetCore.Mvc;

namespace FinanceTracker.Web.Controllers;

[ApiController]
[Route("api/configuration")]
public class ConfigurationController(
    ConfigQueries query,
    Repository repository
) : ControllerBase
{
    [HttpGet]
    public ConfigurationDto GetConfiguration()
        => query.GetConfiguration();
    
    [HttpPost("group-types")]
    public IActionResult UpsertGroupType([FromBody] GroupTypeDto groupType)
    {
        repository.Upsert(groupType.ToGroupType());
        return NoContent();
    }

    [HttpDelete("group-types/{groupTypeId:guid}")]
    public IActionResult DeleteGroupType(Guid groupTypeId)
    {
        repository.Delete<GroupType>(groupTypeId);
        return NoContent();
    }

    [HttpPost("groups")]
    public IActionResult UpsertGroup([FromBody] GroupDto group)
    {
        repository.Upsert(group.ToGroup());
        return NoContent();
    }
    
    [HttpDelete("groups/{groupId:guid}")]
    public IActionResult DeleteGroup(Guid groupId)
    {
        repository.Delete<Group>(groupId);
        return NoContent();
    }
    
    [HttpPost("components")]
    public IActionResult UpsertComponent([FromBody] ComponentConfigDto component)
    {
        repository.Upsert(component.ToComponent());
        return NoContent();
    }
    
    [HttpDelete("components/{componentId:guid}")]
    public IActionResult DeleteComponent(Guid componentId)
    {
        repository.Delete<Component>(componentId);
        return NoContent();
    }
    
    [HttpGet("physical-allocations")]
    public OrderableEntityDto[] GetPhysicalAllocations()
        => query.GetPhysicalAllocations();

    [HttpPost("physical-allocations")]
    public IActionResult UpsertPhysicalAllocation([FromBody] OrderableEntityDto physicalAllocation)
    {
        repository.Upsert(physicalAllocation.ToPhysicalAllocation());
        return NoContent();
    }
    
    [HttpDelete("physical-allocations/{physicalAllocationId:guid}")]
    public IActionResult DeletePhysicalAllocation(Guid physicalAllocationId)
    {
        repository.Delete<PhysicalAllocation>(physicalAllocationId);
        return NoContent();
    }
}