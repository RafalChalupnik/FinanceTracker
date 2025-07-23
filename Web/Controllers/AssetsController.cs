using FinanceTracker.Core;
using FinanceTracker.Core.Primitives;
using FinanceTracker.Web.DTOs;
using FinanceTracker.Web.Extensions;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace FinanceTracker.Web.Controllers;

[ApiController]
[Route("assets")]
public class AssetsController(FinanceTrackerContext context) : ControllerBase
{
    [HttpGet]
    public AssetsDto GetAssets()
    {
        var assets = context.Assets
            .Include(asset => asset.ValueHistory)
            .ToArray();
        
        var dates = assets
            .SelectMany(asset => asset.ValueHistory
                .Select(date => date.Date))
            .Distinct()
            .OrderBy(date => date)
            .ToArray();

        return new AssetsDto(
            Data: dates
                .Select(date => BuildAssetsDataDto(date, assets))
                .ToArray()
                .Scan(CalculateChanges)
                .ToArray()
        );
    }

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
        
        asset.Evaluate(valueUpdate.Date, new Money(valueUpdate.Value, "PLN", valueUpdate.Value));
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

    private static AssetDataDto BuildAssetsDataDto(DateOnly date, IEnumerable<Asset> assets)
    {
        var assetDtos = assets
            .Select(asset => new ValueSnapshotDto(
                Name: asset.Name,
                Value: asset.GetValueFor(date).AmountInMainCurrency,
                Id: asset.Id
            ))
            .ToArray();
        
        return new AssetDataDto(
            Date: date,
            Assets: assetDtos,
            Summary: new ValueSnapshotDto(
                Name: "Summary",
                Value: assetDtos.Sum(asset => asset.Value)
            )
        );
    }
    
    private static AssetDataDto CalculateChanges(AssetDataDto previous, AssetDataDto current)
    {
        return current with
        {
            Assets = previous.Assets
                .Zip(current.Assets)
                .Select(pair => ValueSnapshotDto.CalculateChanges(pair.First, pair.Second))
                .ToArray(),
            Summary = ValueSnapshotDto.CalculateChanges(previous.Summary, current.Summary)
        };
    }
}