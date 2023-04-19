using MediatR;
using AutoMapper;
using StartFromScratch.Models;
using Microsoft.EntityFrameworkCore;
using StartFromScratch.Entities;
using StartFromScratch.Services;
namespace StartFromScratch.Usecases.Products.Queries;
public record GetProductsWithPaginationCommand : IRequest<Result>
{
    public int PageNumber {get;init;}
    public int PageSize {get;init;}

}
public class GetProductsWithPaginationCommandHandler : IRequestHandler<GetProductsWithPaginationCommand, Result>
{
    private readonly DataContext _context;
    private readonly IProductService _productService;
    public GetProductsWithPaginationCommandHandler(DataContext context, IProductService productService)
    {
        _context = context;
        _productService = productService;
    }
    public async Task<Result> Handle(GetProductsWithPaginationCommand request, CancellationToken cancellationToken)
    {  
        PaginatedList<Product> entities =   await  _productService.GetWithPagination(request.PageNumber, request.PageSize);
        BaseReponse reponse = new BaseReponse {
            Message = "Query Success!",
            Data = entities
        };
        return Result.Success(reponse);
    }
}