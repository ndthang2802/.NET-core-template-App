
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
public record UpdateUserCommand : IRequest<Result>, IMapTo<User>
{
    public int Id {get; init;}
    public string? Username { get; init; }
    public string? PhoneNumber { get; init; }
    public string? Address { get; init; }
    public string? Email { get; init; }
    public string? Password { get; init; }

    public void Mapping(Profile profile)
    {
        profile.CreateMap<UpdateUserCommand, User>().ForMember(d => d.PasswordHash, opt => opt.MapFrom(s => BCrypt.Net.BCrypt.HashPassword(s.Password)));
    }
}
public class UpdateUserCommandValidator : AbstractValidator<UpdateUserCommand>
{
    private readonly DataContext _context;

    public UpdateUserCommandValidator(DataContext context)
    {
        _context = context;
        When(v => v.Username is not null, () => {
            RuleFor(v => v.Username)
                        .MaximumLength(30).WithMessage("Username must not exceed 30 characters.")
                        .MustAsync(BeUniqueUsername).WithMessage("The specified username already exists.");
        });
        When(v => v.Email is not null, () => {
            RuleFor(v => v.Email)
                        .NotEmpty().NotNull().WithMessage("Email is required.")
                        .MaximumLength(100).WithMessage("Username must not exceed 30 characters.") // Change to format of email
                        .MustAsync(BeUniqueEmail).WithMessage("The specified username already exists.");
        });
        
    }

    public async Task<bool> BeUniqueUsername(string username, CancellationToken cancellationToken)
    {
        return await _context.Users
            .AllAsync(l => l.Username != username, cancellationToken);
    }
    public async Task<bool> BeUniqueEmail(string email, CancellationToken cancellationToken)
    {
        return await _context.Users
            .AllAsync(l => l.Email != email, cancellationToken);
    }
}


public class UpdateUserCommandHandler : IRequestHandler<UpdateUserCommand, Result>
{
    private readonly IMapper _mapper ;
    private readonly IUserService _userService;
    private readonly ICurrentUserService _currentUserService;

    public UpdateUserCommandHandler(IUserService userService,ICurrentUserService currentUserService, IMapper mapper)
    {
        _mapper = mapper;
        _userService = userService;
        _currentUserService = currentUserService;
    }

    public async Task<Result> Handle(UpdateUserCommand request, CancellationToken cancellationToken)
    {
        if (!_currentUserService.IsCurrentUserCanEdit(request.Id))
        {
            throw new ForbiddenAccessException();
        };
        User? UserToUpdate = await _userService.GetById(request.Id);
        if (UserToUpdate == null)
        {
            return Result.ItemNotFound();
        }
        _mapper.Map<UpdateUserCommand,User>(request , UserToUpdate);
        bool succeeded = await  _userService.UpdateAndSave(UserToUpdate);
        if (succeeded)
        {
            BaseReponse reponse = new BaseReponse {
                Message = "Update User Success!",
                Data = UserToUpdate
            };
            return Result.Success(reponse);
        }
        else {
            return Result.Failure(HttpStatusCode.BadRequest, new string [] {"Add user Fails"});
        }
    }
}