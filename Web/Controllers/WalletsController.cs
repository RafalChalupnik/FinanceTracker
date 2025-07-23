using FinanceTracker.Core;
using FinanceTracker.Core.Primitives;
using FinanceTracker.Web.DTOs;
using FinanceTracker.Web.Extensions;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace FinanceTracker.Web.Controllers;

[ApiController]
[Route("wallets")]
public class WalletsController(FinanceTrackerContext context) : ControllerBase
{
    [HttpGet]
    public WalletsDto GetWallets()
    {
        var wallets = context.Wallets
            .Include(wallet => wallet.Components)
            .ThenInclude(component => component.ValueHistory)
            .ToArray();
        
        var dates = wallets
            .SelectMany(wallet => wallet.Components)
            .SelectMany(component => component.ValueHistory
                .Select(date => date.Date))
            .Distinct()
            .OrderBy(date => date)
            .ToArray();

        return new WalletsDto(
            Wallets: wallets
                .Select(wallet => BuildWalletDto(wallet, dates))
                .ToArray()
        );
    }
    
    [HttpPut("components/{componentId:guid}")]
    public async Task<IActionResult> EvaluateWalletComponent(Guid componentId, [FromBody] ValueUpdateDto valueUpdate)
    {
        var component = context.Components
            .Include(component => component.ValueHistory)
            .FirstOrDefault(component => component.Id == componentId);

        if (component == null)
        {
            return NotFound();
        }

        var alreadyExistingEntry = component.ValueHistory.FirstOrDefault(entry => entry.Date == valueUpdate.Date);
        var newMoney = new Money(valueUpdate.Value, "PLN", valueUpdate.Value);
        
        if (alreadyExistingEntry != null)
        {
            alreadyExistingEntry.Value = newMoney;
        }
        else
        {
            var newEntry = new HistoricValue
            {
                Id = Guid.NewGuid(),
                Date = valueUpdate.Date,
                Value = newMoney
            };

            component.ValueHistory.Add(newEntry);
            context.HistoricValues.Add(newEntry);
        }

        await context.SaveChangesAsync();
        return Ok();
    }

    private static WalletDto BuildWalletDto(Wallet wallet, IReadOnlyCollection<DateOnly> dates)
    {
        return new WalletDto(
            Name: wallet.Name,
            Data: dates
                .Select(date => BuildWalletDataDto(wallet, date))
                .ToArray()
                .Scan(CalculateChanges)
                .ToArray()
        );
    }

    private static WalletDataDto BuildWalletDataDto(Wallet wallet, DateOnly date)
    {
        var components = wallet.Components
            .Select(component => new ValueSnapshotDto(
                Name: component.Name,
                Id: component.Id,
                Value: component.GetValueFor(date).AmountInMainCurrency
            ))
            .ToArray();
        
        return new WalletDataDto(
            Date: date,
            Components: components,
            Summary: new ValueSnapshotDto(
                Name: "Summary",
                Value: components.Sum(component => component.Value)
            )
        );
    }
    
    private static WalletDataDto CalculateChanges(
        WalletDataDto previous, 
        WalletDataDto current)
    {
        return current with
        {
            Components = previous.Components
                .Zip(current.Components)
                .Select(pair => ValueSnapshotDto.CalculateChanges(pair.First, pair.Second))
                .ToArray(),
            Summary = ValueSnapshotDto.CalculateChanges(previous.Summary, current.Summary)
        };
    }
}