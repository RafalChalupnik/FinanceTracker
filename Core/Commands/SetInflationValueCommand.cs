using FinanceTracker.Core.Interfaces;

namespace FinanceTracker.Core.Commands;

public class SetInflationValueCommand(IRepository repository)
{
    public async ValueTask SetInflationValue(int year, int month, decimal value)
    {
        if (month is < 1 or > 12)
        {
            throw new ArgumentException("Invalid month", nameof(month));
        }
        
        var alreadyExistingValue = repository.GetEntities<InflationHistoricValue>()
            .FirstOrDefault(historicValue => historicValue.Year == year && historicValue.Month == month);

        if (alreadyExistingValue != null)
        {
            alreadyExistingValue.Value = value;
        }
        else
        {
            repository.Add(new InflationHistoricValue
            {
                Year = year,
                Month = month,
                Value = value
            });
        }
        
        await repository.SaveChangesAsync();
    }
}