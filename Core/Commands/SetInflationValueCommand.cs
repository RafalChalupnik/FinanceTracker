using FinanceTracker.Core.Commands.DTOs;

namespace FinanceTracker.Core.Commands;

public class SetInflationValueCommand(FinanceTrackerContext dbContext)
{
    public async ValueTask SetInflationValue(InflationUpdateDto update)
    {
        if (update.Month is < 1 or > 12)
        {
            throw new ArgumentException("Invalid month", nameof(update.Month));
        }
        
        var alreadyExistingValue = dbContext.InflationValues
            .FirstOrDefault(historicValue => historicValue.Year == update.Year && historicValue.Month == update.Month);

        if (alreadyExistingValue != null)
        {
            alreadyExistingValue.Value = update.Value;
            alreadyExistingValue.Confirmed = update.Confirmed;
        }
        else
        {
            dbContext.InflationValues.Add(new InflationHistoricValue
            {
                Year = update.Year,
                Month = update.Month,
                Value = update.Value,
                Confirmed = update.Confirmed
            });
        }
        
        await dbContext.SaveChangesAsync();
    }
}