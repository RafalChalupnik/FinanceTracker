using FinanceTracker.Web.DTOs;
using Microsoft.AspNetCore.Mvc;

namespace FinanceTracker.Web.Controllers;

[ApiController]
[Route("api/ledger")]
public class LedgerController : ControllerBase
{
    [HttpGet]
    public IReadOnlyCollection<TransactionDto> GetTransactions()
        => [];

    [HttpPost]
    public IActionResult UpsertTransaction(TransactionDto transaction)
        => NoContent();
    
    [HttpDelete("{transactionId:guid}")]
    public IActionResult DeleteTransaction(Guid transactionId)
        => NoContent();
}