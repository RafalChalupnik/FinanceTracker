using FinanceTracker.Core.Primitives;
using Microsoft.EntityFrameworkCore;

namespace FinanceTracker.Core.Commands;

public class SetEntityValueCommand(FinanceTrackerContext dbContext)
{
    public async ValueTask SetAssetValue(Guid assetId, DateOnly date, Money value)
    {
        var alreadyExistingEntry = await dbContext.Set<HistoricValue>()
            .FirstOrDefaultAsync(entry => entry.AssetId == assetId && entry.Date == date);

        if (alreadyExistingEntry != null)
        {
            alreadyExistingEntry.Value = value;
        }
        else
        {
            await dbContext.Set<HistoricValue>().AddAsync(
                HistoricValue.CreateAssetValue(date, value, assetId)
            );
        }

        await dbContext.SaveChangesAsync();
    }
    
    public async ValueTask SetDebtValue(Guid debtId, DateOnly date, Money value)
    {
        var alreadyExistingEntry = await dbContext.Set<HistoricValue>()
            .FirstOrDefaultAsync(entry => entry.DebtId == debtId && entry.Date == date);

        if (alreadyExistingEntry != null)
        {
            alreadyExistingEntry.Value = value;
        }
        else
        {
            await dbContext.Set<HistoricValue>().AddAsync(
                HistoricValue.CreateDebtValue(date, value, debtId)
            );
        }

        await dbContext.SaveChangesAsync();
    }
    
    public async ValueTask SetWalletComponentValue(Guid componentId, DateOnly date, Money value, Guid? physicalAllocationId)
    {
        var alreadyExistingEntry = await dbContext.Set<HistoricValue>()
            .FirstOrDefaultAsync(entry => entry.ComponentId == componentId && entry.Date == date);
        
        if (alreadyExistingEntry != null)
        {
            alreadyExistingEntry.Value = value;
            alreadyExistingEntry.PhysicalAllocationId = physicalAllocationId;
        }
        else
        {
            var component = dbContext.Set<Component>()
                .Include(x => x.ValueHistory)
                .First(x => x.Id == componentId);
            
            await dbContext.Set<HistoricValue>().AddAsync(new HistoricValue
            {
                Id = Guid.NewGuid(),
                Date = date,
                Value = value,
                ComponentId = componentId,
                PhysicalAllocationId = physicalAllocationId ?? component.DefaultPhysicalAllocationId
            });
        }

        await dbContext.SaveChangesAsync();
    }
}