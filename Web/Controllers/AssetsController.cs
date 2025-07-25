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
[Route("assets")]
public class AssetsController(
    FinanceTrackerContext context,
    AssetsPerDateQuery assetsPerDateQuery,
    EvaluateEntityCommand evaluateEntityCommand,
    DeleteAllEvaluationsForDateCommand deleteAllEvaluationsForDateCommand
    ) : ControllerBase
{
    [HttpGet]
    public EntitiesPerDateQueryDto GetAssets()
    {
        // TODO: Hack
        var portfolioId = context.Portfolios.First().Id;
        
        return assetsPerDateQuery.GetAssetsPerDate(portfolioId);
    }

    [HttpPut("{assetId:guid}")]
    public async Task<IActionResult> EvaluateAsset(Guid assetId, [FromBody] ValueUpdateDto valueUpdate)
    {
        await evaluateEntityCommand.Evaluate<Asset>(
            entityId: assetId, 
            date: valueUpdate.Date, 
            new Money(
                Amount: valueUpdate.Value, 
                Currency: "PLN", 
                AmountInMainCurrency: valueUpdate.Value
            )
        );
        
        return NoContent();
    }

    [HttpDelete("{date}")]
    public async Task<IActionResult> DeleteEvaluationsFor(DateOnly date)
    {
        // TODO: Hack
        var portfolioId = context.Portfolios.First().Id;
        
        await deleteAllEvaluationsForDateCommand.DeleteAllEvaluationsForDate<Asset>(portfolioId, date);
        
        return NoContent();
    }
}