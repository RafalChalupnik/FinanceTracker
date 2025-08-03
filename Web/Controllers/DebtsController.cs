using FinanceTracker.Core;
using FinanceTracker.Core.Commands;
using FinanceTracker.Core.Primitives;
using FinanceTracker.Core.Queries;
using FinanceTracker.Core.Queries.DTOs;
using FinanceTracker.Web.DTOs;
using Microsoft.AspNetCore.Mvc;

namespace FinanceTracker.Web.Controllers;

[ApiController]
[Route("api/debts")]
public class DebtsController(
    SummaryQueries query,
    EvaluateEntityCommand evaluateEntityCommand,
    DeleteAllEvaluationsForDateCommand deleteAllEvaluationsForDateCommand
    ) : ControllerBase
{
    [HttpGet]
    public EntitiesPerDateQueryDto GetDebts() 
        => query.GetDebts();

    [HttpPut("{debtId:guid}")]
    public async Task<IActionResult> EvaluateDebt(Guid debtId, [FromBody] ValueUpdateDto valueUpdate)
    {
        await evaluateEntityCommand.Evaluate<Debt>(
            entityId: debtId, 
            date: valueUpdate.Date, 
            value: valueUpdate.Value
        );
        
        return NoContent();
    }
    
    [HttpDelete("{date}")]
    public async Task<IActionResult> DeleteEvaluationsFor(DateOnly date)
    {
        await deleteAllEvaluationsForDateCommand.DeleteAllEvaluationsForDate<Debt>(date);
        return NoContent();
    }
}