using FinanceTracker.Core;
using FinanceTracker.Core.Commands;
using FinanceTracker.Core.Primitives;
using FinanceTracker.Core.Queries;
using FinanceTracker.Core.Queries.DTOs;
using FinanceTracker.Web.DTOs;
using Microsoft.AspNetCore.Mvc;

namespace FinanceTracker.Web.Controllers;

[ApiController]
[Route("wallets")]
public class WalletsController(
    WalletsPerDateQuery walletsPerDateQuery,
    EvaluateEntityCommand evaluateEntityCommand,
    DeleteAllEvaluationsForDateCommand deleteAllEvaluationsForDateCommand
) : ControllerBase
{
    [HttpGet]
    public WalletsPerDateQueryDto GetWallets() 
        => walletsPerDateQuery.GetWalletsPerDate();

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
        await deleteAllEvaluationsForDateCommand.DeleteAllWalletComponentEvaluationsForDate(walletId, date);
        
        return NoContent();
    }
}