using FinanceTracker.Core.Views;
using FinanceTracker.Core.Views.DTOs;
using Microsoft.AspNetCore.Mvc;

namespace FinanceTracker.Web.Controllers;

[ApiController]
[Route("portfolio")]
public class PortfolioController(
    FinanceTrackerContext context,
    PortfolioPerDateView portfolioPerDateView,
    WalletsSummaryPerDateView walletsSummaryPerDateView
    ) : ControllerBase
{
    [HttpGet("summary")]
    public PortfolioPerDateViewDto GetSummary()
    {
        // TODO: Hack
        var portfolioId = context.Portfolios.First().Id;

        return portfolioPerDateView.GetPortfolioPerDate(portfolioId);
    }

    [HttpGet("wallets")]
    public EntitiesPerDateViewDto GetWallets()
    {
        // TODO: Hack
        var portfolioId = context.Portfolios.First().Id;
        
        return walletsSummaryPerDateView.GetWalletsSummaryPerDate(portfolioId);
    }
}