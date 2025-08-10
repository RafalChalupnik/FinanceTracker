using FinanceTracker.Core.Commands.DTOs;
using FinanceTracker.Core.Interfaces;

namespace FinanceTracker.Core.Commands;

public class SetInflationValueCommand(IRepository repository)
{
    public async ValueTask SetInflationValue(InflationUpdateDto update)
    {
        if (update.Month is < 1 or > 12)
        {
            throw new ArgumentException("Invalid month", nameof(update.Month));
        }
        
        var alreadyExistingValue = repository.GetEntities<InflationHistoricValue>()
            .FirstOrDefault(historicValue => historicValue.Year == update.Year && historicValue.Month == update.Month);

        if (alreadyExistingValue != null)
        {
            alreadyExistingValue.Value = update.Value;
            alreadyExistingValue.Confirmed = update.Confirmed;
        }
        else
        {
            repository.Add(new InflationHistoricValue
            {
                Year = update.Year,
                Month = update.Month,
                Value = update.Value,
                Confirmed = update.Confirmed
            });
        }
        
        await repository.SaveChangesAsync();
    }
}