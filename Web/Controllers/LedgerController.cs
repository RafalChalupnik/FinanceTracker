using FinanceTracker.Core.Commands;
using FinanceTracker.Core.DTOs;
using FinanceTracker.Core.Queries;
using Microsoft.AspNetCore.Mvc;

namespace FinanceTracker.Web.Controllers;

[ApiController]
[Route("api/ledger")]
public class LedgerController(
    LedgerCommands commands,
    LedgerQueries queries
    ) : ControllerBase
{
    [HttpGet]
    public IReadOnlyCollection<TransactionDto> GetTransactions()
        => queries.GetTransactions();

    [HttpPost]
    public IActionResult UpsertTransaction([FromBody] TransactionDto transaction)
    {
        commands.UpsertTransaction(transaction);
        return NoContent();
    }

    [HttpDelete("{transactionId:guid}")]
    public IActionResult DeleteTransaction(Guid transactionId)
    {
        commands.DeleteTransaction(transactionId);
        return NoContent();
    }
}