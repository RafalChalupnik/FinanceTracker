using FinanceTracker.Core;
using FinanceTracker.Core.Commands;
using FinanceTracker.Core.Entities;
using FinanceTracker.Core.Queries;
using FinanceTracker.Core.Queries.DTOs;
using Microsoft.AspNetCore.Mvc;

namespace FinanceTracker.Web.Controllers;

[ApiController]
[Route("api/configuration")]
public class ConfigurationController(
    ConfigQueries query,
    UpsertEntityCommand upsertEntityCommand,
    DeleteEntityCommand deleteEntityCommand
) : ControllerBase
{
    [HttpGet]
    public ConfigurationDto GetConfiguration()
        => query.GetConfiguration();
    
    [HttpGet("groups2")]
    public IReadOnlyCollection<GroupTypeDto> GetGroups()
        => query.GetGroups();
    
    [HttpGet("wallets")]
    public OrderableEntityDto[] GetWallets()
        => query.GetWallets();
    
    [HttpGet("physical-allocations")]
    public OrderableEntityDto[] GetPhysicalAllocations()
        => query.GetPhysicalAllocations();

    [HttpPost("assets")]
    public async Task<IActionResult> UpsertAsset([FromBody] OrderableEntityDto asset)
    {
        await upsertEntityCommand.Upsert<Asset>(asset);
        return NoContent();
    }
    
    [HttpDelete("assets/{assetId:guid}")]
    public async Task<IActionResult> DeleteAsset(Guid assetId)
    {
        await deleteEntityCommand.Delete<Asset>(assetId);
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
    
    [HttpPost("physical-allocations")]
    public async Task<IActionResult> UpsertPhysicalAllocation([FromBody] OrderableEntityDto physicalAllocation)
    {
        await upsertEntityCommand.Upsert<PhysicalAllocation>(physicalAllocation);
        return NoContent();
    }
    
    [HttpDelete("physical-allocations/{physicalAllocationId:guid}")]
    public async Task<IActionResult> DeletePhysicalAllocation(Guid physicalAllocationId)
    {
        await deleteEntityCommand.Delete<PhysicalAllocation>(physicalAllocationId);
        return NoContent();
    }
    
    [HttpPost("wallets")]
    public async Task<IActionResult> UpsertWallet([FromBody] OrderableEntityDto wallet)
    {
        await upsertEntityCommand.Upsert<Wallet>(wallet);
        return NoContent();
    }

    [HttpDelete("wallets/{walletId:guid}")]
    public async Task<IActionResult> DeleteWallet(Guid walletId)
    {
        await deleteEntityCommand.Delete<Wallet>(walletId);
        return NoContent();
    }
    
    [HttpPost("wallets/{walletId:guid}/components")]
    public async Task<IActionResult> UpsertWalletComponent(Guid walletId, [FromBody] WalletComponentDataDto component)
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