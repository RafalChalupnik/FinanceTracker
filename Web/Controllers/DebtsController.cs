using FinanceTracker.Core;
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
            .Include(debt => debt.AmountHistory)
            .ToArray();
        
        var dates = debts
            .SelectMany(debt => debt.AmountHistory
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
    
    private static DebtDataDto BuildDebtsDataDto(DateOnly date, IEnumerable<Debt> assets)
    {
        var debtDtos = assets
            .Select(asset => new ValueSnapshotDto(
                Name: asset.Name,
                Value: -asset.GetAmountFor(date).AmountInMainCurrency
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