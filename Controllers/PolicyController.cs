using StartFromScratch.Usecases.Policies.Queries;
using StartFromScratch.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using StartFromScratch.Entities;
namespace StartFromScratch.Controllers;

//[Authorize]
public class PolicyController : ApiControllerBase
{
   
    [Authorize(roles: new string[]{}, policies: new Policy[] { Policy.GETALLPOLICY})]
    [HttpGet("getall")]
    public async Task<ActionResult<Result>> GetAll([FromQuery] GetAllPoliciesCommand command)
    {
        return await Mediator.Send(command);
    }
    
}
