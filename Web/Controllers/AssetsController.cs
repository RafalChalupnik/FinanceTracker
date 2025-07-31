using FinanceTracker.Core;
using FinanceTracker.Core.Commands;
using FinanceTracker.Core.Primitives;
using FinanceTracker.Core.Queries;
using FinanceTracker.Core.Queries.DTOs;
using FinanceTracker.Web.DTOs;
using Microsoft.AspNetCore.Mvc;

namespace FinanceTracker.Web.Controllers;

// GET /assets
// PUT /assets/{id}/evaluations/{date}
// DELETE /assets/evaluations/{date}

// GET /debts
// PUT /debts/{id}/evaluations/{date}
// DELETE /debts/evaluations/{date}

// GET /portfolio

// GET /wallets
// GET /wallets/components
// PUT /wallets/components/{id}/evaluations/{date}
// DELETE /wallets/components/evaluations/{date}

[ApiController]
[Route("assets")]
public class AssetsController(
    SummaryQueries query,
    EvaluateEntityCommand evaluateEntityCommand,
    DeleteAllEvaluationsForDateCommand deleteAllEvaluationsForDateCommand
    ) : ControllerBase
{
    [HttpGet]
    public EntitiesPerDateQueryDto GetAssets() 
        => query.GetAssets();

    [HttpPut("{assetId:guid}")]
    public async Task<IActionResult> EvaluateAsset(Guid assetId, [FromBody] ValueUpdateDto valueUpdate)
    {
        await evaluateEntityCommand.Evaluate<Asset>(
            entityId: assetId, 
            date: valueUpdate.Date, 
            value: valueUpdate.Value
        );
        
        return NoContent();
    }

    [HttpDelete("{date}")]
    public async Task<IActionResult> DeleteEvaluationsFor(DateOnly date)
    {
        await deleteAllEvaluationsForDateCommand.DeleteAllEvaluationsForDate<Asset>(date);
        return NoContent();
    }
}