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
    public GetCurrentUserCommandHandler(DataContext context, ICurrentUserService userService, IMapper mapper)
    {
        _context = context;
        _mapper = mapper;
        _userService = userService;
    }
    public async Task<Result> Handle(GetCurrentUserCommand request, CancellationToken cancellationToken)
    {  
        User? user =   _userService.User;
        if (user != null)
        {
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