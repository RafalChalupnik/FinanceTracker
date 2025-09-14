using FinanceTracker.Core.Interfaces;
using FinanceTracker.Core.Queries.DTOs;

namespace FinanceTracker.Core.Repositories;

public class Repository(FinanceTrackerContext dbContext)
{
    public IReadOnlyCollection<OrderableEntityDto> GetOrderableEntities<T>() where T : class, IOrderableEntity
    {
        return dbContext.Set<T>()
            .OrderBy(x => x.DisplaySequence)
            .AsEnumerable()
            .Select(OrderableEntityDto.FromEntity)
            .ToArray();
    }

    public void Upsert<T>(T entity) where T : class, IEntity
    {
        var alreadyExists = dbContext.Set<T>().Any(e => e.Id == entity.Id);
        
        if (alreadyExists)
        {
            dbContext.Set<T>().Update(entity);
        }
        else
        {
            dbContext.Set<T>().Add(entity);
        }

        dbContext.SaveChanges();
    }

    public void Delete<T>(Guid id) where T : class, IEntity
    {
        var entity = dbContext.Set<T>().Find(id);
        dbContext.Set<T>().Remove(entity!);
        dbContext.SaveChanges();   
    }
}