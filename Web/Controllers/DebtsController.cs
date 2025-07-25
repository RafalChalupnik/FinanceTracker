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
[Route("debts")]
public class DebtsController(
    FinanceTrackerContext context,
    DebtsPerDateQuery debtsPerDateQuery,
    EvaluateEntityCommand evaluateEntityCommand,
    DeleteAllEvaluationsForDateCommand deleteAllEvaluationsForDateCommand
    ) : ControllerBase
{
    [HttpGet]
    public EntitiesPerDateQueryDto GetDebts()
    {
        // TODO: Hack
        var portfolioId = context.Portfolios.First().Id;
        
        return debtsPerDateQuery.GetDebtsPerDate(portfolioId);
    }

    [HttpPut("{debtId:guid}")]
    public async Task<IActionResult> EvaluateDebt(Guid debtId, [FromBody] ValueUpdateDto valueUpdate)
    {
        await evaluateEntityCommand.Evaluate<Debt>(
            entityId: debtId, 
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
        
        await deleteAllEvaluationsForDateCommand.DeleteAllEvaluationsForDate<Debt>(portfolioId, date);
        
        return NoContent();
    }
}