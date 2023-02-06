
using MediatR;
using AutoMapper;
using System.Net;
using FluentValidation;
using Microsoft.EntityFrameworkCore;
using StartFromScratch.Models;
using StartFromScratch.Entities;
using StartFromScratch.Services;
using StartFromScratch.Mappings;
namespace StartFromScratch.Usecases.Users.Commands;
public record AddUserCommand : IRequest<Result>, IMapTo<User>
{
    public string? Username { get; init; }
    public string? PhoneNumber { get; init; }
    public string? Address { get; init; }
    public string? Email { get; init; }
    public string? Password { get; init; }

    public void Mapping(Profile profile)
    {
        profile.CreateMap<AddUserCommand, User>().ForMember(d => d.PasswordHash, opt => opt.MapFrom(s => BCrypt.Net.BCrypt.HashPassword(s.Password)));
    }
}
public class AddUserCommandValidator : AbstractValidator<AddUserCommand>
{
    private readonly DataContext _context;

    public AddUserCommandValidator(DataContext context)
    {
        _context = context;

        RuleFor(v => v.Username)
            .NotEmpty().NotNull().WithMessage("Username is required.")
            .MaximumLength(30).WithMessage("Username must not exceed 30 characters.")
            .MustAsync(BeUniqueUsername).WithMessage("The specified username already exists.");
        RuleFor(v => v.Email)
            .NotEmpty().NotNull().WithMessage("Email is required.")
            .MaximumLength(100).WithMessage("Username must not exceed 30 characters.") // Change to format of email
            .MustAsync(BeUniqueEmail).WithMessage("The specified username already exists.");
    }

    public async Task<bool> BeUniqueUsername(string username, CancellationToken cancellationToken)
    {
        return await _context.Users
            .AllAsync(l => l.Username == username, cancellationToken);
    }
    public async Task<bool> BeUniqueEmail(string email, CancellationToken cancellationToken)
    {
        return await _context.Users
            .AllAsync(l => l.Email == email, cancellationToken);
    }
}


public class AddUserCommandHandler : IRequestHandler<AddUserCommand, Result>
{
    private readonly IMapper _mapper ;
    private readonly IUserService _userService;

    public AddUserCommandHandler(IUserService userService, IMapper mapper)
    {
        _mapper = mapper;
        _userService = userService;
    }

    public async Task<Result> Handle(AddUserCommand request, CancellationToken cancellationToken)
    {
        
        User entity =  _mapper.Map<AddUserCommand,User>(request);
        bool succeeded = await  _userService.AddAsync(entity);
        if (succeeded)
        {
            BaseReponse reponse = new BaseReponse {
                Message = "Add User Success!",
                Responses = entity
            };
            return Result.Success(reponse);
        }
        else {
            return Result.Failure(HttpStatusCode.BadRequest, new string [] {"Add user Fails"});
        }
    }
}