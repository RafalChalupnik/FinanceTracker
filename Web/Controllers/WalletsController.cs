using FinanceTracker.Core;
using FinanceTracker.Core.Commands;
using FinanceTracker.Core.Primitives;
using FinanceTracker.Core.Queries;
using FinanceTracker.Core.Queries.DTOs;
using FinanceTracker.Web.DTOs;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace FinanceTracker.Web.Controllers;

[ApiController]
[Route("wallets")]
public class WalletsController(
    FinanceTrackerContext context,
    WalletsPerDateQuery walletsPerDateQuery,
    EvaluateEntityCommand evaluateEntityCommand
) : ControllerBase
{
    [HttpGet]
    public WalletsPerDateQueryDto GetWallets()
    {
        // TODO: Hack
        var portfolioId = context.Portfolios.First().Id;
        
        return walletsPerDateQuery.GetWalletsPerDate(portfolioId);
    }

    [HttpPut("components/{componentId:guid}")]
    public async Task<IActionResult> EvaluateWalletComponent(Guid componentId, [FromBody] ValueUpdateDto valueUpdate)
    {
        await evaluateEntityCommand.Evaluate<Component>(
            entityId: componentId, 
            date: valueUpdate.Date, 
            new Money(
                Amount: valueUpdate.Value, 
                Currency: "PLN", 
                AmountInMainCurrency: valueUpdate.Value
            )
        );
        
        return NoContent();
    }
    
    [HttpDelete("{walletId:guid}/{date}")]
    public async Task<IActionResult> DeleteEvaluationsFor(Guid walletId, DateOnly date)
    {
        await context.Wallets
            .Include(wallet => wallet.Components)
            .ThenInclude(component => component.ValueHistory)
            .Where(wallet => wallet.Id == walletId)
            .SelectMany(wallet => wallet.Components)
            .SelectMany(component => component.ValueHistory)
            .Where(entry => entry.Date == date)
            .ExecuteDeleteAsync();

        return NoContent();
    }
}