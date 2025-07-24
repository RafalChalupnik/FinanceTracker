using FinanceTracker.Core.Primitives;
using FinanceTracker.Core.Views;
using FinanceTracker.Core.Views.DTOs;
using FinanceTracker.Web.DTOs;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace FinanceTracker.Web.Controllers;

[ApiController]
[Route("assets")]
public class AssetsController(
    FinanceTrackerContext context,
    AssetsPerDateView assetsPerDateView
    ) : ControllerBase
{
    [HttpGet("{portfolioId:guid}")]
    public EntitiesPerDateViewDto GetAssets(Guid portfolioId) 
        => assetsPerDateView.GetAssetsPerDate(portfolioId);

    [HttpPut("{assetId:guid}")]
    public async Task<IActionResult> EvaluateAsset(Guid assetId, [FromBody] ValueUpdateDto valueUpdate)
    {
        var asset = context.Assets
            .Include(asset => asset.ValueHistory)
            .FirstOrDefault(asset => asset.Id == assetId);

        if (asset == null)
        {
            return NotFound();
        }
        
        var newValue = asset.Evaluate(valueUpdate.Date, new Money(valueUpdate.Value, "PLN", valueUpdate.Value));
        if (newValue != null)
        {
            context.Add(newValue);
        }
        await context.SaveChangesAsync();
        
        return NoContent();
    }

    [HttpDelete("{date}")]
    public async Task<IActionResult> DeleteEvaluationsFor(DateOnly date)
    {
        await context.Assets
            .Include(asset => asset.ValueHistory)
            .SelectMany(asset => asset.ValueHistory)
            .Where(entry => entry.Date == date)
            .ExecuteDeleteAsync();

        return NoContent();
    }
}