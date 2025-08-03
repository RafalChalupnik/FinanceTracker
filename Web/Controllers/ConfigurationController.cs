using FinanceTracker.Core;
using FinanceTracker.Core.Commands;
using FinanceTracker.Core.Queries;
using FinanceTracker.Core.Queries.DTOs;
using Microsoft.AspNetCore.Mvc;

namespace FinanceTracker.Web.Controllers;

[ApiController]
[Route("config")]
public class ConfigurationController(
    ConfigQueries query,
    UpsertEntityCommand upsertEntityCommand,
    DeleteEntityCommand deleteEntityCommand
) : ControllerBase
{
    [HttpGet]
    public ConfigurationDto GetConfiguration()
        => query.GetConfiguration();

    [HttpPost("assets")]
    public async Task<IActionResult> UpsertAsset([FromBody] OrderableEntityDto asset)
    {
        await upsertEntityCommand.Upsert<Asset>(asset);
        return NoContent();
    }
    
    [HttpDelete("assets/{debtId:guid}")]
    public async Task<IActionResult> DeleteAsset(Guid debtId)
    {
        await deleteEntityCommand.Delete<Asset>(debtId);
        return NoContent();
    }
    
    [HttpPost("debts")]
    public async Task<IActionResult> UpsertDebt([FromBody] OrderableEntityDto debt)
    {
        await upsertEntityCommand.Upsert<Debt>(debt);
        return NoContent();
    }
    
    [HttpDelete("debts/{debtId:guid}")]
    public async Task<IActionResult> DeleteDebt(Guid debtId)
    {
        await deleteEntityCommand.Delete<Debt>(debtId);
        return NoContent();
    }
}