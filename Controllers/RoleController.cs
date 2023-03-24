using StartFromScratch.Usecases.Roles.Commands;
using StartFromScratch.Usecases.Roles.Queries;
using StartFromScratch.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using StartFromScratch.Entities;
namespace StartFromScratch.Controllers;

//[Authorize]
public class RoleController : ApiControllerBase
{
    [AuthorizeAttribute( roles: new string[] {"Administrator"}, policies: new Policy[] {Policy.ADDROLE})]
    [HttpPost("add")]
    public async Task<ActionResult<Result>> Create(AddRoleCommand command)
    {
        return await Mediator.Send(command);
    }
    [AuthorizeAttribute( roles: new string[] {"Administrator"}, policies: new Policy[] {Policy.GETALLROLE})]
    [HttpGet("getall")]
    public async Task<ActionResult<Result>> GetAll([FromQuery] GetAllRolesCommand command)
    {
        return await Mediator.Send(command);
    }
    [HttpGet("get")]
    public async Task<ActionResult<Result>> GetLowerRole([FromQuery] GetAllLowerRolesCommand command)
    {
        return await Mediator.Send(command);
    }

    [HttpPost("update")]
    public async Task<ActionResult<Result>> UpdateRole([FromBody] UpdateRoleCommand command)
    {
        return await Mediator.Send(command);
    }
    
}
