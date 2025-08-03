using FinanceTracker.Core;
using FinanceTracker.Core.Commands;
using FinanceTracker.Core.Queries;
using FinanceTracker.Core.Queries.DTOs;
using Microsoft.AspNetCore.Mvc;

namespace FinanceTracker.Web.Controllers;

[ApiController]
[Route("api/config")]
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
    
    [HttpPost("wallets/{walletId:guid}/components")]
    public async Task<IActionResult> UpsertWalletComponent(Guid walletId, [FromBody] OrderableEntityDto component)
    {
        await upsertEntityCommand.UpsertWalletComponent(walletId, component);
        return NoContent();
    }
    
    [HttpDelete("wallets/components/{componentId:guid}")]
    public async Task<IActionResult> DeleteWalletComponent(Guid componentId)
    {
        await deleteEntityCommand.Delete<Component>(componentId);
        return NoContent();
    }
}