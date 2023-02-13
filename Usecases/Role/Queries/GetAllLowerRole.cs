using MediatR;
using AutoMapper;
using StartFromScratch.Models;
using StartFromScratch.Entities;
using StartFromScratch.Services;
namespace StartFromScratch.Usecases.Roles.Queries;
public record GetAllLowerRolesCommand : IRequest<Result>;
public class GetAllLowerRolesCommandHandler : IRequestHandler<GetAllLowerRolesCommand, Result>
{
    private readonly IRoleService _roleService;
    private readonly ICurrentUserService _currentUserService;
    public GetAllLowerRolesCommandHandler(IRoleService roleService,ICurrentUserService currentUserService)
    {
        _roleService = roleService;
        _currentUserService = currentUserService;
    }
    public async Task<Result> Handle(GetAllLowerRolesCommand request, CancellationToken cancellationToken)
    {  
        string? roles = _currentUserService.Roles;
        if (string.IsNullOrEmpty(roles))
        {
           BaseReponse reponse_ = new BaseReponse {
                Message = "Query Success!",
                Responses = ""
            };
            return Result.Success(reponse_);
        }
        IList<Role> rolesOfUser = await _roleService.GetByCodes(roles.Split(","));
        IList<Role> entities =   await  _roleService.GetAllLowerLevel(rolesOfUser.Select(x=>x.Level).ToList().Min());
        BaseReponse reponse = new BaseReponse {
            Message = "Query Success!",
            Responses = entities
        };
        return Result.Success(reponse);
    }
}