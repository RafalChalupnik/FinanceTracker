using FinanceTracker.Core.Interfaces;

namespace FinanceTracker.Core.Commands;

public class SetInflationValueCommand(IRepository repository)
{
    public async ValueTask SetInflationValue(DateOnly date, decimal value)
    {
        var alreadyExistingValue = repository.GetEntities<InflationHistoricValue>()
            .FirstOrDefault(historicValue => historicValue.Date == date);

        if (alreadyExistingValue != null)
        {
            alreadyExistingValue.Value = value;
        }
        else
        {
            repository.Add(new InflationHistoricValue
            {
                Date = date,
                Value = value
            });
        }
        
        await repository.SaveChangesAsync();
    }
}