using FinanceTracker.Core.Queries;
using FinanceTracker.Core.Queries.DTOs;
using Microsoft.AspNetCore.Mvc;

namespace FinanceTracker.Web.Controllers;

[ApiController]
[Route("api/ledger")]
public class LedgerController(LedgerQueries queries) : ControllerBase
{
    [HttpGet]
    public IReadOnlyCollection<TransactionDto> GetTransactions()
        => queries.GetTransactions();

    [HttpPost]
    public IActionResult UpsertTransaction(TransactionDto transaction)
        => NoContent();
    
    [HttpDelete("{transactionId:guid}")]
    public IActionResult DeleteTransaction(Guid transactionId)
        => NoContent();
}