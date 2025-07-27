using FinanceTracker.Core.Queries;
using FinanceTracker.Core.Queries.DTOs;
using Microsoft.AspNetCore.Mvc;

namespace FinanceTracker.Web.Controllers;

[ApiController]
[Route("portfolio")]
public class PortfolioController(
    SummaryQueries query
    ) : ControllerBase
{
    [HttpGet("summary")]
    public EntitiesPerDateQueryDto GetSummary() 
        => query.GetPortfolioSummary();

    [HttpGet("wallets")]
    public EntitiesPerDateQueryDto GetWallets() 
        => query.GetWalletsSummary();
}