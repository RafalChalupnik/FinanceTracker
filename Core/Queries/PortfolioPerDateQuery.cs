using FinanceTracker.Core.Extensions;
using FinanceTracker.Core.Interfaces;
using FinanceTracker.Core.Queries.DTOs;

namespace FinanceTracker.Core.Queries;

public class PortfolioPerDateQuery(IRepository repository)
{
    public PortfolioPerDateQueryDto GetPortfolioPerDate()
    {
        var wallets = repository.GetWallets().ToArray();
        var assets = repository.GetEntitiesWithValueHistory<Asset>().ToArray();
        var debts = repository.GetEntitiesWithValueHistory<Debt>().ToArray();

        var dates = wallets
            .SelectMany(wallet => wallet.GetEvaluationDates())
            .Concat(assets
                .SelectMany(asset => asset.GetEvaluationDates()))
            .Concat(debts
                .SelectMany(debt => debt.GetEvaluationDates()))
            .Distinct()
            .OrderBy(date => date)
            .ToArray();
        
        return new PortfolioPerDateQueryDto(
            Data: dates
                .Select(date => BuildPortfolioForDateDto(
                        date,
                        wallets,
                        assets,
                        debts
                    )
                )
                .ToArray()
                .CalculateChanges()
                .ToArray()
        );
    }

    private static PortfolioForDateDto BuildPortfolioForDateDto(
        DateOnly date,
        IEnumerable<Wallet> wallets,
        IEnumerable<Asset> assets,
        IEnumerable<Debt> debts
        )
    {
        var walletsValues = wallets.Select(wallet => wallet.GetValueFor(date)).ToArray();
        var walletsValue = walletsValues.Any(value => value.HasValue)
            ? new ValueSnapshotDto(
                Value: walletsValues.Sum(value => value ?? 0)
            )
            : null;
        
        var assetsValues = assets.Select(asset => asset.GetValueFor(date)).ToArray();
        var assetsValue = assetsValues.Any(value => value.HasValue)
            ? new ValueSnapshotDto(
                Value: assetsValues.Sum(value => value ?? 0)
            )
            : null;
        
        var debtsValues = debts.Select(debt => debt.GetValueFor(date)).ToArray();
        var debtsValue = debtsValues.Any(value => value.HasValue)
            ? new ValueSnapshotDto(
                Value: -debtsValues.Sum(value => value ?? 0)
            )
            : null;
        
        return new PortfolioForDateDto(
            Date: date,
            Wallets: new EntityValueDto(
                Name: "Wallets",
                Value: walletsValue
            ),
            Assets: new EntityValueDto(
                Name: "Assets",
                Value: assetsValue
            ),
            Debts: new EntityValueDto(
                Name: "Debts",
                Value: debtsValue
            ),
            Summary: new EntityValueDto(
                Name: "Summary",
                Value: new ValueSnapshotDto(
                    Value: (walletsValue?.Value ?? 0) + (assetsValue?.Value ?? 0) + (debtsValue?.Value ?? 0)
                )
            )
        );
    }
}

internal static class PortfolioQueryExtensions
{
    public static IEnumerable<PortfolioForDateDto> CalculateChanges(this IReadOnlyList<PortfolioForDateDto> values)
    {
        PortfolioForDateDto[] firstValue = [values[0]];
        return firstValue
            .Concat(values
                .Scan(CalculateChanges))
            .ToArray();
    }
    
    private static PortfolioForDateDto CalculateChanges(
        PortfolioForDateDto previous, 
        PortfolioForDateDto current)
    {
        var wallets = ValueSnapshotDto.CalculateChanges(previous.Wallets.Value, current.Wallets.Value);
        var assets = ValueSnapshotDto.CalculateChanges(previous.Assets.Value, current.Assets.Value);
        var debts = ValueSnapshotDto.CalculateChanges(previous.Debts.Value, current.Debts.Value);

        var changeSum = (wallets?.Change ?? 0) + (assets?.Change ?? 0) + (debts?.Change ?? 0);
        
        var summary = current.Summary.Value != null
            ? current.Summary.Value with
            {
                Change = changeSum,
                CumulativeChange = changeSum + (previous.Summary.Value?.CumulativeChange ?? 0)
            }
            : null;
        
        return current with
        {
            Wallets = current.Wallets with
            {
                Value = wallets
            },
            Assets = current.Assets with
            {
                Value = assets
            },
            Debts = current.Debts with
            {
                Value = debts
            },
            Summary = current.Summary with
            {
                Value = summary
            }
        };
    }
}