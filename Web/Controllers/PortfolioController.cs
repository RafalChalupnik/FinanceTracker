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
        
        var summarySnapshots = BuildSummarySnapshots(portfolio.Wallets);
        
        return new PortfolioSummaryDto(
            Wallets: portfolio.Wallets
                .Select(wallet => BuildWalletDto(wallet, summarySnapshots))
                .ToArray(),
            Summary: summarySnapshots
        );
    }

    private static ValueSnapshotDto[] BuildSummarySnapshots(IReadOnlyCollection<Wallet> wallets)
    {
        var dates = wallets
            .SelectMany(wallet => wallet.Components)
            .SelectMany(component => component.ValueHistory
                .Select(date => date.Date))
            .Distinct()
            .OrderBy(date => date)
            .ToArray();

        return dates
            .Select(date => new ValueSnapshotDto(
                Date: date,
                Value: wallets
                    .SelectMany(wallet => wallet.Components)
                    .SelectMany(component => component.ValueHistory
                        .Where(historicValue => historicValue.Date == date)
                        .Select(historicValue => historicValue.Value))
                    .Sum(value => value.AmountInMainCurrency),
                Change: 0,
                CumulativeChange: 0,
                ShareOfWallet: 1
            ))
            .ToArray()
            .Scan(UpdateChangeValues)
            .ToArray();
    }
    
    private static WalletDto BuildWalletDto(
        Wallet wallet, 
        IReadOnlyCollection<ValueSnapshotDto> summarySnapshots
    )
    {
        var valuePerDate = wallet.Components
            .SelectMany(component => component.ValueHistory)
            .GroupBy(historicValue => historicValue.Date)
            .ToDictionary(
                keySelector: grouping => grouping.Key,
                elementSelector: grouping => grouping.Sum(x => x.Value.AmountInMainCurrency)
            );

        var walletSnapshots = summarySnapshots
            .Select(summarySnapshot =>
            {
                var value = valuePerDate.GetValueOrDefault(summarySnapshot.Date, defaultValue: 0);

                return new ValueSnapshotDto(
                    Date: summarySnapshot.Date,
                    Value: value,
                    Change: 0,
                    CumulativeChange: 0,
                    ShareOfWallet: value / summarySnapshot.Value
                );
            })
            .ToArray()
            .Scan(UpdateChangeValues)
            .ToArray();

        return new WalletDto(
            Name: wallet.Name,
            Snapshots: walletSnapshots
        );
    }
    
    private static ValueSnapshotDto UpdateChangeValues(ValueSnapshotDto previous, ValueSnapshotDto current)
    {
        var change = current.Value - previous.Value;

        return current with
        {
            Change = change,
            CumulativeChange = change + previous.CumulativeChange
        };
    }
}