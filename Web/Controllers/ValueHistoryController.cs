using FinanceTracker.Core;
using FinanceTracker.Core.Commands;
using FinanceTracker.Core.Primitives;
using FinanceTracker.Core.Queries;
using FinanceTracker.Core.Queries.DTOs;
using FinanceTracker.Web.DTOs;
using Microsoft.AspNetCore.Mvc;

namespace FinanceTracker.Web.Controllers;

[ApiController]
[Route("api/value-history")]
public class ValueHistoryController(
    ValueHistoryQueries query,
    SetEntityValueCommand setEntityValueCommand,
    SetTargetCommand setTargetCommand,
    DeleteValuesForDate deleteValuesForDate
    ) : ControllerBase
{
    [HttpGet("assets")]
    public EntitiesPerDateQueryDto GetAssetsValueHistory(
        [FromQuery] DateGranularity? granularity, 
        [FromQuery] DateOnly? from, 
        [FromQuery] DateOnly? to
        ) 
        => query.ForAssets(granularity, from: from, to: to);
    
    [HttpPut("assets/{assetId:guid}/{date}")]
    public async Task<IActionResult> SetAssetValue(Guid assetId, DateOnly date, [FromBody] Money value)
    {
        await setEntityValueCommand.SetEntityValue<Asset>(
            entityId: assetId, 
            date: date, 
            value: value
        );
        
        return NoContent();
    }
    
    [HttpDelete("assets/{date}")]
    public async Task<IActionResult> DeleteAssetsValues(DateOnly date)
    {
        await deleteValuesForDate.DeleteValues<Asset>(date);
        return NoContent();
    }
    
    [HttpGet("debts")]
    public EntitiesPerDateQueryDto GetDebtsValueHistory(
        [FromQuery] DateGranularity? granularity, 
        [FromQuery] DateOnly? from, 
        [FromQuery] DateOnly? to
        ) 
        => query.ForDebts(granularity, from: from, to: to);
    
    [HttpPut("debts/{debtId:guid}/{date}")]
    public async Task<IActionResult> SetDebtValue(Guid debtId, DateOnly date, [FromBody] Money value)
    {
        await setEntityValueCommand.SetEntityValue<Debt>(
            entityId: debtId, 
            date: date, 
            value: value
        );
        
        return NoContent();
    }
    
    [HttpDelete("debts/{date}")]
    public async Task<IActionResult> DeleteDebtsValues(DateOnly date)
    {
        await deleteValuesForDate.DeleteValues<Debt>(date);
        return NoContent();
    }
    
    [HttpGet("portfolio")]
    public EntitiesPerDateQueryDto GetPortfolioValueHistory(
        [FromQuery] DateGranularity? granularity, 
        [FromQuery] DateOnly? from, 
        [FromQuery] DateOnly? to
        ) 
        => query.ForEntirePortfolio(granularity, from: from, to: to);
    
    [HttpGet("wallets")]
    public WalletsPerDateQueryDto GetWalletsValueHistory(
        [FromQuery] DateGranularity? granularity, 
        [FromQuery] DateOnly? from, 
        [FromQuery] DateOnly? to
        ) 
        => query.ForWallets(granularity, from: from, to: to);

    [HttpPut("wallets/{walletId:guid}/target")]
    public async Task<IActionResult> SetWalletTarget(Guid walletId, [FromBody] TargetUpdateDto update)
    {
        await setTargetCommand.SetTarget(walletId, update.Date, update.TargetInMainCurrency);
        return NoContent();
    }
    
    [HttpDelete("wallets/{walletId:guid}/{date}")]
    public async Task<IActionResult> DeleteWalletValues(Guid walletId, DateOnly date)
    {
        await deleteValuesForDate.DeleteWalletValues(walletId, date);
        return NoContent();
    }
    
    [HttpGet("wallets/components")]
    public WalletsComponentsPerDateQueryDto GetWalletsComponentsValueHistory(
        [FromQuery] DateGranularity? granularity, 
        [FromQuery] DateOnly? from, 
        [FromQuery] DateOnly? to
        ) 
        => query.ForWalletsAndComponents(granularity, from: from, to: to);
    
    [HttpPut("wallets/components/{componentId:guid}/{date}")]
    public async Task<IActionResult> SetWalletComponentValue(Guid componentId, DateOnly date, [FromBody] Money value)
    {
        await setEntityValueCommand.SetEntityValue<Component>(
            entityId: componentId, 
            date: date, 
            value: value
        );
        
        return NoContent();
    }
}