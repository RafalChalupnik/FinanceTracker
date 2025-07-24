using FinanceTracker.Core.Primitives;
using FinanceTracker.Core.Views;
using FinanceTracker.Core.Views.DTOs;
using FinanceTracker.Web.DTOs;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace FinanceTracker.Web.Controllers;

[ApiController]
[Route("wallets")]
public class WalletsController(
    FinanceTrackerContext context,
    WalletsPerDateView walletsPerDateView
) : ControllerBase
{
    [HttpGet("{portfolioId:guid}")]
    public WalletsPerDateViewDto GetWallets(Guid portfolioId)
        => walletsPerDateView.GetWalletsPerDate(portfolioId);
    
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

        var newValue = component.Evaluate(valueUpdate.Date, new Money(valueUpdate.Value, "PLN", valueUpdate.Value));
        if (newValue != null)
        {
            context.Add(newValue);
        }
        await context.SaveChangesAsync();

        return Ok();
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