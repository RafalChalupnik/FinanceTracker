using FinanceTracker.Core.Primitives;
using FinanceTracker.Core.Views;
using FinanceTracker.Core.Views.DTOs;
using FinanceTracker.Web.DTOs;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace FinanceTracker.Web.Controllers;

[ApiController]
[Route("debts")]
public class DebtsController(
    FinanceTrackerContext context,
    DebtsPerDateView debtsPerDateView
    ) : ControllerBase
{
    [HttpGet("{portfolioId:guid}")]
    public EntitiesPerDateViewDto GetDebts(Guid portfolioId) 
        => debtsPerDateView.GetDebtsPerDate(portfolioId);
    
    [HttpPut("{debtId:guid}")]
    public async Task<IActionResult> EvaluateDebt(Guid debtId, [FromBody] ValueUpdateDto valueUpdate)
    {
        var debt = context.Debts
            .Include(debt => debt.ValueHistory)
            .FirstOrDefault(debt => debt.Id == debtId);

        if (debt == null)
        {
            return NotFound();
        }
        
        var newValue = debt.Evaluate(valueUpdate.Date, new Money(Math.Abs(valueUpdate.Value), "PLN", Math.Abs(valueUpdate.Value)));
        if (newValue != null)
        {
            context.Add(newValue);
        }
        await context.SaveChangesAsync();
        
        return Ok();
    }
    
    [HttpDelete("{date}")]
    public async Task<IActionResult> DeleteEvaluationsFor(DateOnly date)
    {
        await context.Debts
            .Include(debt => debt.ValueHistory)
            .SelectMany(debt => debt.ValueHistory)
            .Where(entry => entry.Date == date)
            .ExecuteDeleteAsync();

        return NoContent();
    }
}