using FinanceTracker.Core.Queries;
using FinanceTracker.Core.Queries.DTOs;
using Microsoft.AspNetCore.Mvc;

namespace FinanceTracker.Web.Controllers;

[ApiController]
[Route("portfolio")]
public class PortfolioController(
    PortfolioPerDateQuery portfolioPerDateQuery,
    WalletsSummaryPerDateQuery walletsSummaryPerDateQuery
    ) : ControllerBase
{
    [HttpGet("summary")]
    public PortfolioPerDateQueryDto GetSummary() 
        => portfolioPerDateQuery.GetPortfolioPerDate();

    [HttpGet("wallets")]
    public EntitiesPerDateQueryDto GetWallets() 
        => walletsSummaryPerDateQuery.GetWalletsSummaryPerDate();
}