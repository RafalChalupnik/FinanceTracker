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
            .First();
        
        var dates = portfolio.Wallets
            .SelectMany(wallet => wallet.Components)
            .SelectMany(component => component.ValueHistory
                .Select(date => date.Date))
            .Distinct()
            .OrderBy(date => date)
            .ToArray();

        return new PortfolioSummaryDto(
            dates
                .Select(date => BuildDateSummary(date, portfolio.Wallets))
                .ToArray()
                .Scan(CalculateChanges)
                .ToArray()
        );
    }

    private static DateSummaryDto BuildDateSummary(DateOnly date, IEnumerable<Wallet> wallets)
    {
        var walletDtos = wallets
            .Select(wallet => new ValueSnapshotDto(
                Name: wallet.Name,
                Value: wallet.GetAmountFor(date)
            ))
            .ToArray();
        
        return new DateSummaryDto(
            Date: date,
            Wallets: walletDtos,
            Summary: new ValueSnapshotDto(
                Name: "Summary",
                Value: walletDtos.Sum(wallet => wallet.Value)
            )
        );
    }

    private static DateSummaryDto CalculateChanges(DateSummaryDto previous, DateSummaryDto current)
    {
        return current with
        {
            Wallets = previous.Wallets
                .Zip(current.Wallets)
                .Select(pair => CalculateChanges(pair.First, pair.Second))
                .ToArray(),
            Summary = CalculateChanges(previous.Summary, current.Summary)
        };
    }

    private static ValueSnapshotDto CalculateChanges(ValueSnapshotDto previous, ValueSnapshotDto current)
    {
        var change = current.Value - previous.Value;

        return current with
        {
            Change = change,
            CumulativeChange = change + previous.CumulativeChange
        };
    }
}