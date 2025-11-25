using FinanceTracker.Core.Commands;
using FinanceTracker.Core.Commands.DTOs;
using FinanceTracker.Core.Queries;
using FinanceTracker.Core.Queries.DTOs;
using FinanceTracker.Web.DTOs;
using Microsoft.AspNetCore.Mvc;

namespace FinanceTracker.Web.Controllers;

[ApiController]
[Route("api/value-history")]
public class ValueHistoryController(
    ValueHistoryQueries query,
    SetTargetCommand setTargetCommand,
    SetInflationValueCommand setInflationValueCommand
    ) : ControllerBase
{
    [HttpGet("group-types/{groupTypeId:guid}")]
    public EntityTableDto GetGroupTypeSummary(
        Guid groupTypeId,
        [FromQuery] DateGranularity? granularity,
        [FromQuery] DateOnly? from,
        [FromQuery] DateOnly? to)
        => query.ForGroupType(groupTypeId, granularity, from, to);
    
    [HttpGet("groups/{groupId:guid}")]
    public EntityTableDto GetGroupValueHistory(
        Guid groupId,
        [FromQuery] DateGranularity? granularity,
        [FromQuery] DateOnly? from,
        [FromQuery] DateOnly? to
    )
        => query.ForGroup(groupId, granularity, from, to);
    
    [HttpPut("groups/{groupId:guid}/target")]
    public async Task<IActionResult> SetGroupTarget(Guid groupId, [FromBody] ValueUpdateDto update)
    {
        await setTargetCommand.SetTarget(groupId, update.Date, update.Value);
        return NoContent();
    }
    
    [HttpGet("physical-allocations/{allocationId:guid}")]
    public EntityTableDto GetPhysicalAllocationValueHistory(
        Guid allocationId,
        [FromQuery] DateGranularity? granularity, 
        [FromQuery] DateOnly? from, 
        [FromQuery] DateOnly? to
    ) 
        => query.ForPhysicalAllocations(allocationId, granularity, from: from, to: to);
    
    [HttpGet("portfolio")]
    public EntityTableDto GetPortfolioValueHistory(
        [FromQuery] DateGranularity? granularity, 
        [FromQuery] DateOnly? from, 
        [FromQuery] DateOnly? to
        ) 
        => query.ForEntirePortfolio(granularity, from: from, to: to);
    
    [HttpPut("inflation")]
    public async Task<IActionResult> SetInflation([FromBody] InflationUpdateDto update)
    {
        await setInflationValueCommand.SetInflationValue(update);
        return NoContent();
    }
}