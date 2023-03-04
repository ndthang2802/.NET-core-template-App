using StartFromScratch.Usecases.Users.Commands;
using StartFromScratch.Usecases.Users.Queries;
using StartFromScratch.Models;
using Microsoft.AspNetCore.Mvc;
using StartFromScratch.Services;
namespace StartFromScratch.Controllers;

//[Authorize]
public class UserController : ApiControllerBase
{   
    private readonly IUserService _userService;
    private readonly ICurrentUserService _currentUserService;

    public UserController(IUserService userService, ICurrentUserService currentUserService)  : base() 
    {
        _userService = userService;
        _currentUserService = currentUserService;
    }

    [HttpPost("add")]
    public async Task<ActionResult<Result>> Create(AddUserCommand command)
    {
        return await Mediator.Send(command);
    }
    [HttpPost("auth")]
    public async Task<ActionResult<Result>> Auth(LoginUserCommand command)
    {
        var res = await Mediator.Send(command);
        return StatusCode((int)res.StatusCode, res);
    }
    [Authorize( roles: new string[] { "Administrator"})]
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
    [HttpPost("refesh-token")]
    public async Task<ActionResult> RefreshToken( )
    {
        if (Request.Cookies.ContainsKey("X-Refresh-Token"))
        {
            string? newToken = await _userService.RefreshToken(Request.Cookies["X-Refresh-Token"]);
            if(newToken != null)
            {
                var cookieOptions = new Microsoft.AspNetCore.Http.CookieOptions()
                {
                    HttpOnly = true, 
                    IsEssential = true, 
                    Expires = DateTime.Now.AddMonths(1), 
                    SameSite = SameSiteMode.Strict
                };
                HttpContext.Response.Cookies.Append("X-Access-Token", newToken, cookieOptions);
                return Ok();
            }
        }
         return Unauthorized();
    }
    [HttpGet("get-current-user-infor")]
    public async Task<ActionResult<Result>> GetCurrentUser([FromQuery] GetCurrentUserCommand command)
    {
        var res = await Mediator.Send(command);
        return StatusCode((int)res.StatusCode, res);
    }

}
