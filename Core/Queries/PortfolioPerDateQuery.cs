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
        var walletsValue = wallets.Sum(wallet => wallet.GetValueFor(date)) ?? 0;
        var assetsValue = assets.Sum(asset => asset.GetValueFor(date)) ?? 0;
        var debtsValue = -debts.Sum(debt => debt.GetValueFor(date)) ?? 0;
        
        return new PortfolioForDateDto(
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
                Value: debtsValue
            ),
            Summary: new ValueSnapshotDto(
                Name: "Summary",
                Value: walletsValue + assetsValue + debtsValue
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
        return current with
        {
            Wallets = ValueSnapshotDto.CalculateChanges(previous.Wallets, current.Wallets),
            Assets = ValueSnapshotDto.CalculateChanges(previous.Assets, current.Assets),
            Debts = ValueSnapshotDto.CalculateChanges(previous.Debts, current.Debts),
            Summary = ValueSnapshotDto.CalculateChanges(previous.Summary, current.Summary)       
        };
    }
}