
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
namespace StartFromScratch.Usecases.Users.Commands;
public record AssignRoleToUserCommand : IRequest<Result>, IMapTo<User>
{
    public int UserId { get; init; }
    public string Roles { get; init; } = string.Empty;

}
public class AssignRoleToUserCommandValidator : AbstractValidator<AssignRoleToUserCommand>
{
    private readonly DataContext _context;

    public AssignRoleToUserCommandValidator(DataContext context)
    {
        _context = context;

        RuleFor(v => v.UserId)
            .NotEmpty().NotNull().WithMessage("UserId is required.");
        RuleFor(v => v.Roles)
            .NotEmpty().NotNull().WithMessage("Roles is required.")
            .MustAsync(IsRolesExist).WithMessage("Some role is unknown.");
    }

    public async Task<bool> IsRolesExist(string roles, CancellationToken cancellationToken)
    {
        var roles_request = roles.Split(",");
        var roles_entities = await _context.Roles.Select(r => r.Code).ToListAsync(cancellationToken);
        return roles_request.Any(r => roles_entities.Contains(r));
    }
}
public class AssignRoleToUserCommandHandler : IRequestHandler<AssignRoleToUserCommand, Result>
{
    private readonly IUserService _userService;
    private readonly ICurrentUserService _currentUserService;
    private readonly IRoleService _roleService ;

    public AssignRoleToUserCommandHandler(IUserService userService, IRoleService roleService ,ICurrentUserService currentUserService)
    {
        _userService = userService;
        _currentUserService = currentUserService;
        _roleService = roleService;
    }
    public async Task<Result> Handle(AssignRoleToUserCommand request, CancellationToken cancellationToken)
    {
        IList<Role> roles_request = await _roleService.GetByCodes(request.Roles.Split(","));
        IList<Role> roles_of_current_user = await _roleService.GetByCodes(_currentUserService.Roles?.Split(",") ?? new string[] {});
        if (!_currentUserService.IsCurrentUserHaveGreaterRole(roles_request, roles_of_current_user))//roles_request.All(x => roles_of_current_user.Contains(x) ||   roles_of_current_user.Any(c => c.Level > x.Level )))
        {
            throw new ForbiddenAccessException();
        }

        User? entity =  await  _userService.GetById(request.UserId);
        if(entity == null)
        {
            return Result.ItemNotFound();
        }
        entity.Roles = request.Roles;
        bool succeeded = await  _userService.UpdateAndSave(entity);
        if (succeeded)
        {
            BaseReponse reponse = new BaseReponse {
                Message = "Update User Success!",
                Responses = entity
            };
            return Result.Success(reponse);
        }
        else {
            return Result.Failure(HttpStatusCode.BadRequest, new string [] {"Update user Fails"});
        }
    }
}