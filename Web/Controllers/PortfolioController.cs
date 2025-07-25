using FinanceTracker.Core.Queries;
using FinanceTracker.Core.Queries.DTOs;
using Microsoft.AspNetCore.Mvc;

namespace FinanceTracker.Web.Controllers;

[ApiController]
[Route("portfolio")]
public class PortfolioController(
    FinanceTrackerContext context,
    PortfolioPerDateQuery portfolioPerDateQuery,
    WalletsSummaryPerDateQuery walletsSummaryPerDateQuery
    ) : ControllerBase
{
    [HttpGet("summary")]
    public PortfolioPerDateQueryDto GetSummary()
    {
        // TODO: Hack
        var portfolioId = context.Portfolios.First().Id;

        return portfolioPerDateQuery.GetPortfolioPerDate(portfolioId);
    }

    [HttpGet("wallets")]
    public EntitiesPerDateQueryDto GetWallets()
    {
        // TODO: Hack
        var portfolioId = context.Portfolios.First().Id;
        
        return walletsSummaryPerDateQuery.GetWalletsSummaryPerDate(portfolioId);
    }
}