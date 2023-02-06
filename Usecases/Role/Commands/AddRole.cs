
using MediatR;
using AutoMapper;
using System.Net;
using FluentValidation;
using Microsoft.EntityFrameworkCore;
using StartFromScratch.Models;
using StartFromScratch.Entities;
using StartFromScratch.Services;
using StartFromScratch.Mappings;
namespace StartFromScratch.Usecases.Roles.Commands;
public record AddRoleCommand : IRequest<Result>, IMapTo<Role>
{
    public string? Code { get; init; }
    public string? Description { get; init; }
    public int? Level {get;init;}

    public void Mapping(Profile profile)
    {
        profile.CreateMap<AddRoleCommand, Role>();
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

    public AddRoleCommandHandler(DataContext context, IRoleService RoleService, IMapper mapper)
    {
        _context = context;
        _mapper = mapper;
        _RoleService = RoleService;
    }

    public async Task<Result> Handle(AddRoleCommand request, CancellationToken cancellationToken)
    {
        
        Role entity =  _mapper.Map<AddRoleCommand,Role>(request);
        bool succeeded = await  _RoleService.AddAsync(entity);
        if (succeeded)
        {
            BaseReponse reponse = new BaseReponse {
                Message = "Add Role Success!",
                Responses = entity
            };
            return Result.Success(reponse);
        }
        else {
            return Result.Failure(HttpStatusCode.BadRequest, new string [] {"Add Role Fails"});
        }
    }
}