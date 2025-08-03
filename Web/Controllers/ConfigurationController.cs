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
    UpsertEntityCommand upsertEntityCommand
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
    
    // [HttpPost("debts")]
    // public async Task<IActionResult> UpsertDebt([FromBody] Debt debt)
    // {
    //     await upsertEntityCommand.Upsert<Debt>(debt);
    //     return NoContent();
    // }
}