using MediatR;
using AutoMapper;
using StartFromScratch.Models;
using StartFromScratch.Entities;
using StartFromScratch.Services;
namespace StartFromScratch.Usecases.Roles.Queries;
public record GetAllRolesCommand : IRequest<Result>;
public class GetAllRolesCommandHandler : IRequestHandler<GetAllRolesCommand, Result>
{
    private readonly DataContext _context;
    private readonly IMapper _mapper ;
    private readonly IRoleService _roleService;
    public GetAllRolesCommandHandler(DataContext context ,IRoleService roleService, IMapper mapper)
    {
        _context = context;
        _mapper = mapper;
        _roleService = roleService;
    }
    public async Task<Result> Handle(GetAllRolesCommand request, CancellationToken cancellationToken)
    {  
        IList<Role> entities =   await  _roleService.GetAll();
        BaseReponse reponse = new BaseReponse {
            Message = "Query Success!",
            Data = entities
        };
        return Result.Success(reponse);
    }
}