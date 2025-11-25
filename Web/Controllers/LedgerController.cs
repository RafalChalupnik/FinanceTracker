using FinanceTracker.Web.DTOs;
using Microsoft.AspNetCore.Mvc;

namespace FinanceTracker.Web.Controllers;

[ApiController]
[Route("api/ledger")]
public class LedgerController
{
    [HttpGet]
    public IReadOnlyCollection<TransactionDto> GetTransactions()
    {
        
    }
    
    [HttpPost]
    public void UpsertTransaction(TransactionDto transaction)
    {
        
    }
    
    [HttpDelete("{transactionId:guid}")]
    public void DeleteTransaction(Guid transactionId)
    {
        
    }
}