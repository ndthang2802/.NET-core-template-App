
using MediatR;
using AutoMapper;
using System.Net;
using FluentValidation;
using Microsoft.EntityFrameworkCore;
using StartFromScratch.Models;
using StartFromScratch.Entities;
using StartFromScratch.Services;
using StartFromScratch.Mappings;
using StartFromScratch.Exceptions;
namespace StartFromScratch.Usecases.Roles.Commands;
public record AddRoleCommand : IRequest<Result>, IMapTo<Role>
{
    public string? Code { get; init; }
    public string? Description { get; init; }
    public int? Level {get;init;}
    public IList<Policy>? Policies {get;init;}

    public void Mapping(Profile profile)
    {
        profile.CreateMap<AddRoleCommand, Role>()
                .ForMember(d => d.Policies, opt => opt.MapFrom(s =>  s.Policies != null ? string.Join(",", s.Policies) : ""));
    }
}
public class AddRoleCommandValidator : AbstractValidator<AddRoleCommand>
{
    private readonly DataContext _context;

    public AddRoleCommandValidator(DataContext context)
    {
        _context = context;

        RuleFor(v => v.Code)
            .NotEmpty().NotNull().WithMessage("Role Code is required.")
            .MaximumLength(20).WithMessage("Role Code must not exceed 30 characters.")
            .MustAsync(BeUniqueRoleCode).WithMessage("The specified Role code already exists.");
        RuleFor(v => v.Description)
            .NotEmpty().NotNull().WithMessage("Description is required.")
            .MaximumLength(150).WithMessage("Description must not exceed 150 characters.");
    }

    public async Task<bool> BeUniqueRoleCode(string Code, CancellationToken cancellationToken)
    {
        return await _context.Roles
            .AllAsync(l => l.Code != Code, cancellationToken);
    }
}
public class AddRoleCommandHandler : IRequestHandler<AddRoleCommand, Result>
{
    private readonly DataContext _context;
    private readonly IMapper _mapper ;
    private readonly IRoleService _RoleService;
    private readonly ICurrentUserService _currentUserService;
    private readonly IUserService _userService;

    
    public AddRoleCommandHandler(DataContext context, IRoleService RoleService,ICurrentUserService currentUserService, IUserService UserService, IMapper mapper)
    {
        _context = context;
        _mapper = mapper;
        _RoleService = RoleService;
        _currentUserService = currentUserService;
        _userService = UserService;
    }

    public async Task<Result> Handle(AddRoleCommand request, CancellationToken cancellationToken)
    {
        
        IList<Policy> currentPolices = await _userService.GetPoliciesOfUser(_currentUserService.User ?? new User());
        if (  !_currentUserService.IsAdmin && !(request.Policies != null && request.Policies.All(x => currentPolices.Contains(x))))
        {
            throw new ForbiddenAccessException();
        }
        string? roles = _currentUserService.Roles;
        int threshhold_level_roles = int.MaxValue;
        if (!string.IsNullOrEmpty(roles))
        {
           IList<Role> rolesOfUser = await _RoleService.GetByCodes(roles.Split(","));
            threshhold_level_roles = rolesOfUser.Select(x=>x.Level).ToList().Min();
        }
        if (request.Level != null && request.Level <= threshhold_level_roles)
        {
            return Result.Failure(HttpStatusCode.BadRequest, new string [] {"Can not add Role with this level"});
        }
        Role entity =  _mapper.Map<AddRoleCommand,Role>(request);
        bool succeeded = await  _RoleService.AddAsync(entity);
        if (succeeded)
        {
            BaseReponse reponse = new BaseReponse {
                Message = "Add Role Success!",
                Data = entity
            };
            return Result.Success(reponse);
        }
        else {
            return Result.Failure(HttpStatusCode.BadRequest, new string [] {"Add Role Fails"});
        }
    }
}