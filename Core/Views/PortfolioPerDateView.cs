using FinanceTracker.Core.Extensions;
using FinanceTracker.Core.Interfaces;
using FinanceTracker.Core.Views.DTOs;

namespace FinanceTracker.Core.Views;

public class PortfolioPerDateView(IRepository repository)
{
    public PortfolioPerDateViewDto GetPortfolioPerDate(Guid portfolioId)
    {
        var wallets = repository.GetEntitiesFor<Wallet>(portfolioId).ToArray();
        var assets = repository.GetEntitiesFor<Asset>(portfolioId).ToArray();
        var debts = repository.GetEntitiesFor<Debt>(portfolioId).ToArray();

        var dates = wallets
            .SelectMany(wallet => wallet.GetEvaluationDates())
            .Concat(assets
                .SelectMany(asset => asset.GetEvaluationDates()))
            .Concat(debts
                .SelectMany(debt => debt.GetEvaluationDates()))
            .Distinct()
            .OrderBy(date => date)
            .ToArray();
        
        return new PortfolioPerDateViewDto(
            Data: dates
                .Select(date => BuildPortfolioForDateDto(
                        date,
                        wallets,
                        assets,
                        debts
                    )
                )
                .ToArray()
                .Scan(CalculateChanges)
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