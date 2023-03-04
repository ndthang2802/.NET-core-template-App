
using MediatR;
using AutoMapper;
using System.Net;
using FluentValidation;
using StartFromScratch.Models;
using StartFromScratch.Services;
using System.Security.Claims;

namespace StartFromScratch.Usecases.Users.Commands;
public record LoginUserCommand : IRequest<Result>
{
    public string Username { get; init; } = string.Empty;
    public string Password { get; init; } = string.Empty;
}
public class LoginUserCommandValidator : AbstractValidator<LoginUserCommand>
{
    private readonly DataContext _context;
    public LoginUserCommandValidator(DataContext context)
    {
        _context = context;
        RuleFor(v => v.Username)
            .NotEmpty().NotNull().WithMessage("Username is required.");
        RuleFor(v => v.Password)
            .NotEmpty().NotNull().WithMessage("Pasword is required.");
    }
}
public class LoginUserCommandHandler : IRequestHandler<LoginUserCommand, Result>
{
    private readonly DataContext _context;
    private readonly IUserService _userService;
    private readonly ICurrentUserService _currentuser;
    public LoginUserCommandHandler(DataContext context, IUserService userService, ICurrentUserService currentuser)
    {
        _context = context;
        _userService = userService;
        _currentuser = currentuser;
    }
    public async Task<Result> Handle(LoginUserCommand request, CancellationToken cancellationToken)
    {
        LoginResponse? result =  await _userService.Authenticate(request.Username,request.Password);
        if (result != null)
        {
            _currentuser.HttpContextSignin(result.access_token, result.refresh_token);
            BaseReponse reponse = new BaseReponse {
                Message = "Login User Success!",
                Data = result
            };
            return Result.Success(reponse);
            }
        else {
            return Result.Failure(HttpStatusCode.BadRequest, new string [] {"Login Fails!. Invalid Username or Password"});
        }
    }
}