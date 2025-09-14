using FinanceTracker.Core.Entities;
using FinanceTracker.Core.Queries.DTOs;
using FinanceTracker.Core.Repositories;
using Microsoft.AspNetCore.Mvc;

namespace FinanceTracker.Web.Controllers.Configuration;

[ApiController]
[Route("api/configuration/group-types")]
public class GroupTypesController(Repository repository)
{
    [HttpGet]
    public IReadOnlyCollection<OrderableEntityDto> GetGroupTypes() 
        => repository.GetOrderableEntities<GroupType>();

    [HttpPost]
    public void UpsertGroupType(OrderableEntityDto groupType) 
        => repository.Upsert(groupType.ToGroupType());
    
    [HttpDelete("{groupTypeId:guid}")]
    public void UpsertGroupType(Guid groupTypeId)
        => repository.Delete<GroupType>(groupTypeId);
}