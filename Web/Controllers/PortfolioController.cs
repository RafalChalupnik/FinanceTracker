using FinanceTracker.Core;
using FinanceTracker.Web.DTOs;
using FinanceTracker.Web.Extensions;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace FinanceTracker.Web.Controllers;

[ApiController]
[Route("portfolio")]
public class PortfolioController(FinanceTrackerContext context) : ControllerBase
{
    [HttpGet("summary")]
    public PortfolioSummaryDto GetSummary()
    {
        var portfolio = context.Portfolios
            .Include(portfolio => portfolio.Wallets)
            .ThenInclude(wallet => wallet.Components)
            .ThenInclude(component => component.ValueHistory)
            .Include(portfolio => portfolio.Assets)
            .ThenInclude(component => component.ValueHistory)
            .Include(portfolio => portfolio.Debts)
            .ThenInclude(component => component.ValueHistory)
            .First();
        
        var dates = portfolio.Wallets
            .SelectMany(wallet => wallet.Components)
            .SelectMany(component => component.ValueHistory
                .Select(date => date.Date))
            .Concat(portfolio.Assets
                .SelectMany(asset => asset.ValueHistory)
                .Select(date => date.Date))
            .Concat(portfolio.Debts
                .SelectMany(debt => debt.ValueHistory)
                .Select(date => date.Date))
            .Distinct()
            .OrderBy(date => date)
            .ToArray();

        return new PortfolioSummaryDto(
            Data: dates
                .Select(date => BuildPortfolioDateSummary(date, portfolio))
                .ToArray()
                .Scan(CalculateChanges)
                .ToArray()
        );
    }
    
    [HttpGet("wallets")]
    public WalletsSummaryDto GetWallets()
    {
        var portfolio = context.Portfolios
            .Include(portfolio => portfolio.Wallets)
            .ThenInclude(wallet => wallet.Components)
            .ThenInclude(component => component.ValueHistory)
            .First();
        
        var dates = portfolio.Wallets
            .SelectMany(wallet => wallet.Components)
            .SelectMany(component => component.ValueHistory
                .Select(date => date.Date))
            .Distinct()
            .OrderBy(date => date)
            .ToArray();

        return new WalletsSummaryDto(
            Data: dates
                .Select(date => BuildWalletsDateSummary(date, portfolio.Wallets))
                .ToArray()
                .Scan(CalculateChanges)
                .ToArray()
        );
    }

    private static PortfolioDateSummaryDto BuildPortfolioDateSummary(DateOnly date, Portfolio portfolio)
    {
        var walletsValue = portfolio.Wallets.Sum(wallet => wallet.GetValueFor(date));
        var assetsValue = portfolio.Assets.Sum(asset => asset.GetValueFor(date)?.AmountInMainCurrency ?? 0);
        var debtsAmount = -portfolio.Debts.Sum(debt => debt.GetValueFor(date)?.AmountInMainCurrency ?? 0);
        
        return new PortfolioDateSummaryDto(
            Date: date,
            Wallets: new ValueSnapshotDto(
                Name: "Wallets",
                Value: walletsValue
            ),
            Assets: new ValueSnapshotDto(
                Name: "Assets",
                Value: assetsValue
            ),
            Debts: new ValueSnapshotDto(
                Name: "Debts",
                Value: debtsAmount
            ),
            Summary: new ValueSnapshotDto(
                Name: "Summary",
                Value: walletsValue + assetsValue + debtsAmount
            )
        );
    }
    
    private static PortfolioDateSummaryDto CalculateChanges(
        PortfolioDateSummaryDto previous, 
        PortfolioDateSummaryDto current)
    {
        return current with
        {
            Wallets = ValueSnapshotDto.CalculateChanges(previous.Wallets, current.Wallets),
            Assets = ValueSnapshotDto.CalculateChanges(previous.Assets, current.Assets),
            Debts = ValueSnapshotDto.CalculateChanges(previous.Debts, current.Debts),
            Summary = ValueSnapshotDto.CalculateChanges(previous.Summary, current.Summary)
        };
    }

    private static WalletsDateSummaryDto BuildWalletsDateSummary(DateOnly date, IEnumerable<Wallet> wallets)
    {
        var walletDtos = wallets
            .OrderBy(asset => asset.DisplaySequence)
            .Select(wallet => new ValueSnapshotDto(
                Name: wallet.Name,
                Value: wallet.GetValueFor(date)
            ))
            .ToArray();
        
        return new WalletsDateSummaryDto(
            Date: date,
            Wallets: walletDtos,
            Summary: new ValueSnapshotDto(
                Name: "Summary",
                Value: walletDtos.Sum(wallet => wallet.Value)
            )
        );
    }

    private static WalletsDateSummaryDto CalculateChanges(WalletsDateSummaryDto previous, WalletsDateSummaryDto current)
    {
        return current with
        {
            Wallets = previous.Wallets
                .Zip(current.Wallets)
                .Select(pair => ValueSnapshotDto.CalculateChanges(pair.First, pair.Second))
                .ToArray(),
            Summary = ValueSnapshotDto.CalculateChanges(previous.Summary, current.Summary)
        };
    }
}