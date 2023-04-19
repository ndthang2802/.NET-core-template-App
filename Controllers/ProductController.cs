using StartFromScratch.Usecases.Products.Commands;
using StartFromScratch.Usecases.Products.Queries;
using StartFromScratch.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using StartFromScratch.Entities;
namespace StartFromScratch.Controllers;

//[Authorize]
public class ProductController : ApiControllerBase
{
    private IWebHostEnvironment  _environment;
    //private string productImageSavePath = "";
    public ProductController(IWebHostEnvironment  environment) : base ()
    {
        _environment = environment;
        //productImageSavePath = _environment.WebRootPath + "/images/products/";
    }
    [HttpPost("add")]
    public async Task<ActionResult<Result>> Create(AddProductCommand command)
    {
        return await Mediator.Send(command);
    }

    [HttpGet("img")]
    public IActionResult Get(string name)
    {
        string productImageSavePath = _environment.WebRootPath + "/images/products/";
        try {
            var image = System.IO.File.OpenRead(productImageSavePath + name);
            return File(image, "image/jpg");
        }
        catch {
            return  NotFound(); 
        }
    }
    // [AuthorizeAttribute( roles: new string[] {}, policies: new Policy[] {Policy.GETALLCATEGORIES})]
    [HttpPost("delete")]
    public async Task<ActionResult<Result>> DeleteProduct([FromBody] DeleteProductCommand command)
    {
        return await Mediator.Send(command);
    }
    [HttpPost("query")]
    public async Task<ActionResult<Result>> QueryProduct([FromBody] GetProductsWithPaginationCommand command)
    {
        return await Mediator.Send(command);
    }
    // [AuthorizeAttribute( roles: new string[] {}, policies: new Policy[] {Policy.UPDATEProduct})]
    // [HttpPost("update")]
    // public async Task<ActionResult<Result>> UpdateProduct([FromBody] UpdateProductCommand command)
    // {
    //     return await Mediator.Send(command);
    // }
    
}
