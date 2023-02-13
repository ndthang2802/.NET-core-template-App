using MediatR;
using AutoMapper;
using StartFromScratch.Models;
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
    private readonly IMapper _mapper ;
    private readonly IProductService _productService;
    public GetProductsWithPaginationCommandHandler(DataContext context, IProductService productService, IMapper mapper)
    {
        _context = context;
        _mapper = mapper;
        _productService = productService;
    }
    public async Task<Result> Handle(GetProductsWithPaginationCommand request, CancellationToken cancellationToken)
    {  
        PaginatedList<Product> entities =   await  _productService.GetWithPagination(request.PageNumber, request.PageSize);
        BaseReponse reponse = new BaseReponse {
            Message = "Query Success!",
            Responses = entities
        };
        return Result.Success(reponse);
    }
}