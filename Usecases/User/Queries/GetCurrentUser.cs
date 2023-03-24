using MediatR;
using AutoMapper;
using StartFromScratch.Models;
using StartFromScratch.Entities;
using StartFromScratch.Services;
namespace StartFromScratch.Usecases.Users.Queries;
public record GetCurrentUserCommand : IRequest<Result>;
public class GetCurrentUserCommandHandler : IRequestHandler<GetCurrentUserCommand, Result>
{
    private readonly DataContext _context;
    private readonly IMapper _mapper ;
    private readonly ICurrentUserService _userService;
    private readonly IPolicyService _policyService;
    private readonly IRoleService _roleService;

    public GetCurrentUserCommandHandler(DataContext context, ICurrentUserService userService,IPolicyService policyService,IRoleService roleService, IMapper mapper)
    {
        _context = context;
        _mapper = mapper;
        _userService = userService;
        _policyService = policyService;
        _roleService = roleService;
    }
    public async Task<Result> Handle(GetCurrentUserCommand request, CancellationToken cancellationToken)
    {  
        User? user =   _userService.User;
        int? id = _userService.UserId;
        if (user != null)
        {
            user.Policies = await _policyService.GetAllPoliciesOfUser(user);
            user.ListRoles = await _roleService.GetByCodes(user.Roles.Split(","));
            BaseReponse reponse = new BaseReponse {
                Message = "Query Success!",
                Data = user
            };
            await Task.CompletedTask;
            return  Result.Success(reponse);
        }
        else {
            return Result.Failure(System.Net.HttpStatusCode.BadRequest, new string[] {"Not found"});
        }
    }
}