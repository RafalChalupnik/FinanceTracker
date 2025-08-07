using FinanceTracker.Core;
using FinanceTracker.Core.Commands;
using FinanceTracker.Core.Primitives;
using FinanceTracker.Core.Queries;
using FinanceTracker.Core.Queries.DTOs;
using Microsoft.AspNetCore.Mvc;

namespace FinanceTracker.Web.Controllers;

[ApiController]
[Route("api/value-history")]
public class ValueHistoryController(
    ValueHistoryQueries query,
    SetEntityValueCommand setEntityValueCommand,
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
    public EntitiesPerDateQueryDto GetWalletsValueHistory(
        [FromQuery] DateGranularity? granularity, 
        [FromQuery] DateOnly? from, 
        [FromQuery] DateOnly? to
        ) 
        => query.ForWallets(granularity, from: from, to: to);
    
    [HttpDelete("wallets/{walletId:guid}/{date}")]
    public async Task<IActionResult> DeleteWalletValues(Guid walletId, DateOnly date)
    {
        await deleteValuesForDate.DeleteWalletValues(walletId, date);
        return NoContent();
    }
    
    [HttpGet("wallets/components")]
    public WalletsPerDateQueryDto GetWalletsComponentsValueHistory(
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