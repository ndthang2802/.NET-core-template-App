using StartFromScratch.Usecases.Users.Commands;
using StartFromScratch.Usecases.Users.Queries;
using StartFromScratch.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace StartFromScratch.Controllers;

//[Authorize]
public class UserController : ApiControllerBase
{   
    [HttpPost("add")]
    public async Task<ActionResult<Result>> Create(AddUserCommand command)
    {
        return await Mediator.Send(command);
    }
    [HttpPost("auth")]
    public async Task<ActionResult<Result>> Auth(LoginUserCommand command)
    {
        return await Mediator.Send(command);
    }
    [Authorize("Administrator")]
    [HttpGet("all")]
    public async Task<ActionResult<Result>> GetAll([FromQuery] GetAllUserCommand command)
    {
        return await Mediator.Send(command);
    }
    [Authorize]
    [HttpPost("update")]
    public async Task<ActionResult<Result>> Update(UpdateUserCommand command)
    {
        return await Mediator.Send(command);
    }
    
}
