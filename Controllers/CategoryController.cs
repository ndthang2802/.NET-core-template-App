using StartFromScratch.Usecases.Categories.Commands;
using StartFromScratch.Usecases.Categories.Queries;
using StartFromScratch.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using StartFromScratch.Entities;
namespace StartFromScratch.Controllers;

//[Authorize]
public class CategoryController : ApiControllerBase
{
    [AuthorizeAttribute( roles: new string[] {}, policies: new Policy[] {Policy.ADDCATEGORY})]
    [HttpPost("add")]
    public async Task<ActionResult<Result>> Create(AddCategoryCommand command)
    {
        return await Mediator.Send(command);
    }
    [AuthorizeAttribute( roles: new string[] {}, policies: new Policy[] {Policy.GETALLCATEGORIES})]
    [HttpGet("getall")]
    public async Task<ActionResult<Result>> GetAll([FromQuery] GetAllCategoriesCommand command)
    {
        return await Mediator.Send(command);
    }
    // [HttpGet("get")]
    // public async Task<ActionResult<Result>> GetLowerCategory([FromQuery] GetAllLowerCategorysCommand command)
    // {
    //     return await Mediator.Send(command);
    // }
    [AuthorizeAttribute( roles: new string[] {}, policies: new Policy[] {Policy.UPDATECATEGORY})]
    [HttpPost("update")]
    public async Task<ActionResult<Result>> UpdateCategory([FromBody] UpdateCategoryCommand command)
    {
        return await Mediator.Send(command);
    }
    
}
