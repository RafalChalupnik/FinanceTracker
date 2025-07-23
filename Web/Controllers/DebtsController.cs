using FinanceTracker.Core;
using FinanceTracker.Core.Primitives;
using FinanceTracker.Web.DTOs;
using FinanceTracker.Web.Extensions;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace FinanceTracker.Web.Controllers;

[ApiController]
[Route("debts")]
public class DebtsController(FinanceTrackerContext context) : ControllerBase
{
    [HttpGet]
    public DebtsDto GetDebts()
    {
        var debts = context.Debts
            .Include(debt => debt.ValueHistory)
            .ToArray();
        
        var dates = debts
            .SelectMany(debt => debt.ValueHistory
                .Select(date => date.Date))
            .Distinct()
            .OrderBy(date => date)
            .ToArray();

        return new DebtsDto(
            Data: dates
                .Select(date => BuildDebtsDataDto(date, debts))
                .ToArray()
                .Scan(CalculateChanges)
                .ToArray()
        );
    }
    
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
        
        debt.Evaluate(valueUpdate.Date, new Money(Math.Abs(valueUpdate.Value), "PLN", Math.Abs(valueUpdate.Value)));
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
    
    private static DebtDataDto BuildDebtsDataDto(DateOnly date, IEnumerable<Debt> assets)
    {
        var debtDtos = assets
            .Select(debt => new ValueSnapshotDto(
                Name: debt.Name,
                Id: debt.Id,
                Value: -debt.GetValueFor(date)?.AmountInMainCurrency ?? 0
            ))
            .ToArray();
        
        return new DebtDataDto(
            Date: date,
            Debts: debtDtos,
            Summary: new ValueSnapshotDto(
                Name: "Summary",
                Value: debtDtos.Sum(debt => debt.Value)
            )
        );
    }
    
    private static DebtDataDto CalculateChanges(DebtDataDto previous, DebtDataDto current)
    {
        return current with
        {
            Debts = previous.Debts
                .Zip(current.Debts)
                .Select(pair => ValueSnapshotDto.CalculateChanges(pair.First, pair.Second))
                .ToArray(),
            Summary = ValueSnapshotDto.CalculateChanges(previous.Summary, current.Summary)
        };
    }
}