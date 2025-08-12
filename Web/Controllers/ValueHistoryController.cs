using FinanceTracker.Core;
using FinanceTracker.Core.Commands;
using FinanceTracker.Core.Commands.DTOs;
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
    DeleteValuesForDate deleteValuesForDate,
    SetInflationValueCommand setInflationValueCommand
    ) : ControllerBase
{
    [HttpGet("assets")]
    public EntityTableDto<ValueHistoryRecordDto> GetAssetsValueHistory(
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
    public EntityTableDto<ValueHistoryRecordDto> GetDebtsValueHistory(
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
    
    [HttpGet("physical-allocations/{allocationId:guid}")]
    public EntityTableDto<ValueHistoryRecordDto> GetPhysicalAllocationValueHistory(
        Guid allocationId,
        [FromQuery] DateGranularity? granularity, 
        [FromQuery] DateOnly? from, 
        [FromQuery] DateOnly? to
    ) 
        => query.ForPhysicalAllocations(allocationId, granularity, from: from, to: to);
    
    [HttpGet("portfolio")]
    public EntityTableDto<ValueHistoryRecordDto> GetPortfolioValueHistory(
        [FromQuery] DateGranularity? granularity, 
        [FromQuery] DateOnly? from, 
        [FromQuery] DateOnly? to
        ) 
        => query.ForEntirePortfolio(granularity, from: from, to: to);
    
    [HttpGet("wallets")]
    public EntityTableDto<WalletValueHistoryRecordDto> GetWalletsValueHistory(
        [FromQuery] DateGranularity? granularity, 
        [FromQuery] DateOnly? from, 
        [FromQuery] DateOnly? to
        ) 
        => query.ForWallets(granularity, from: from, to: to);

    [HttpPut("wallets/{walletId:guid}/target")]
    public async Task<IActionResult> SetWalletTarget(Guid walletId, [FromBody] ValueUpdateDto update)
    {
        await setTargetCommand.SetTarget(walletId, update.Date, update.Value);
        return NoContent();
    }
    
    [HttpDelete("wallets/{walletId:guid}/{date}")]
    public async Task<IActionResult> DeleteWalletValues(Guid walletId, DateOnly date)
    {
        await deleteValuesForDate.DeleteWalletValues(walletId, date);
        return NoContent();
    }
    
    [HttpGet("wallets/{walletId:guid}/components")]
    public EntityTableDto<WalletComponentsValueHistoryRecordDto> GetWalletsComponentsValueHistory(
        Guid walletId,
        [FromQuery] DateGranularity? granularity, 
        [FromQuery] DateOnly? from, 
        [FromQuery] DateOnly? to
        ) 
        => query.ForWallet(walletId, granularity, from: from, to: to);
    
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
    
    [HttpPut("inflation")]
    public async Task<IActionResult> SetInflation([FromBody] InflationUpdateDto update)
    {
        await setInflationValueCommand.SetInflationValue(update);
        return NoContent();
    }
}