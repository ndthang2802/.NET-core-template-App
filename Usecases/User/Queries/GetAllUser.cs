using MediatR;
using AutoMapper;
using StartFromScratch.Models;
using StartFromScratch.Entities;
using StartFromScratch.Services;
namespace StartFromScratch.Usecases.Users.Queries;
public record GetAllUserCommand : IRequest<Result>;
public class GetAllUserCommandHandler : IRequestHandler<GetAllUserCommand, Result>
{
    private readonly DataContext _context;
    private readonly IMapper _mapper ;
    private readonly IUserService _userService;
    public GetAllUserCommandHandler(DataContext context, IUserService userService, IMapper mapper)
    {
        _context = context;
        _mapper = mapper;
        _userService = userService;
    }
    public async Task<Result> Handle(GetAllUserCommand request, CancellationToken cancellationToken)
    {  
        IList<User> entities =   await  _userService.GetAll();
        BaseReponse reponse = new BaseReponse {
            Message = "Query Success!",
            Data = entities
        };
        return Result.Success(reponse);
    }
}