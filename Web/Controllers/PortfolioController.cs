using FinanceTracker.Core.Queries;
using FinanceTracker.Core.Queries.DTOs;
using Microsoft.AspNetCore.Mvc;

namespace FinanceTracker.Web.Controllers;

[ApiController]
[Route("portfolio")]
public class PortfolioController(
    PortfolioPerDateQuery portfolioPerDateQuery,
    EntityWithValueHistoryPerDateQuery query
    ) : ControllerBase
{
    [HttpGet("summary")]
    public EntitiesPerDateQueryDto GetSummary() 
        => portfolioPerDateQuery.GetPortfolioPerDate();

    [HttpGet("wallets")]
    public EntitiesPerDateQueryDto GetWallets() 
        => query.GetWalletsSummary();
}