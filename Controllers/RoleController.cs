using StartFromScratch.Usecases.Roles.Commands;
using StartFromScratch.Usecases.Roles.Queries;
using StartFromScratch.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace StartFromScratch.Controllers;

//[Authorize]
public class RoleController : ApiControllerBase
{
   
    [HttpPost("add")]
    public async Task<ActionResult<Result>> Create(AddRoleCommand command)
    {
        return await Mediator.Send(command);
    }
    [Authorize("Administrator")]
    [HttpGet("getall")]
    public async Task<ActionResult<Result>> GetAll([FromQuery] GetAllRolesCommand command)
    {
        return await Mediator.Send(command);
    }
    
}
