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

        var alreadyExistingEntry = asset.ValueHistory.FirstOrDefault(entry => entry.Date == valueUpdate.Date);
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

            asset.ValueHistory.Add(newEntry);
        }

        await context.SaveChangesAsync();
        return Ok();
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