using StartFromScratch.Usecases.TodoItems.Commands;
using StartFromScratch.Usecases.TodoItems.Queries;
using StartFromScratch.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace StartFromScratch.Controllers;

public class TodoItemController : ApiControllerBase
{
   
    [Authorize]
    [HttpPost("add")]
    public async Task<ActionResult<Result>> Create(AddTodoItemCommand command)
    {
        return await Mediator.Send(command);
    }
    [Authorize]
    [HttpGet("user-get")]
    public async Task<ActionResult<Result>> GetAll([FromQuery] GetTodoByUserCommand command)
    {
        return await Mediator.Send(command);
    }
    [Authorize]
    [HttpPost("update")]
    public async Task<ActionResult<Result>> Update([FromQuery] UpdateTodoItemCommand command)
    {
        return await Mediator.Send(command);
    }
}
