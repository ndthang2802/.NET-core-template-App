using MediatR;
using AutoMapper;
using StartFromScratch.Models;
using StartFromScratch.Entities;
using StartFromScratch.Services;
namespace StartFromScratch.Usecases.Categories.Queries;
public record GetAllCategoriesCommand : IRequest<Result>;
public class GetAllCategoriesCommandHandler : IRequestHandler<GetAllCategoriesCommand, Result>
{
    private readonly DataContext _context;
    private readonly IMapper _mapper ;
    private readonly ICategoryService _categoryService;
    public GetAllCategoriesCommandHandler(DataContext context ,ICategoryService categoryService, IMapper mapper)
    {
        _context = context;
        _mapper = mapper;
        _categoryService = categoryService;
    }
    public async Task<Result> Handle(GetAllCategoriesCommand request, CancellationToken cancellationToken)
    {  
        IList<Category> entities =   await  _categoryService.GetAllWithNested();
        BaseReponse reponse = new BaseReponse {
            Message = "Query Success!",
            Data = entities
        };
        return Result.Success(reponse);
    }
}