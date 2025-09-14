using FinanceTracker.Core.DTOs;
using FinanceTracker.Core.Entities;
using FinanceTracker.Core.Repositories;
using Microsoft.AspNetCore.Mvc;

namespace FinanceTracker.Web.Controllers.Configuration;

[ApiController]
[Route("api/configuration/groups")]
public class GroupsController(Repository repository)
{
    [HttpGet]
    public IReadOnlyCollection<GroupDto> GetGroups()
        => repository.ListOrderableEntities<Group>()
            .Select(GroupDto.FromEntity)
            .ToArray();
    
    [HttpPost]
    public void UpsertGroup(GroupDto group) 
        => repository.Upsert(group.ToGroup());
    
    [HttpDelete("{groupId:guid}")]
    public void DeleteGroup(Guid groupId)
        => repository.Delete<Group>(groupId);
}