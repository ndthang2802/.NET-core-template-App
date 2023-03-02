using MediatR;
using AutoMapper;
using StartFromScratch.Models;
using StartFromScratch.Entities;
using StartFromScratch.Services;
namespace StartFromScratch.Usecases.TodoItems.Queries;
public record GetTodoByUserCommand : IRequest<Result>;
public class GetTodoByUserCommandHandler : IRequestHandler<GetTodoByUserCommand, Result>
{
    private readonly DataContext _context;
    private readonly IMapper _mapper ;
    private readonly ITodoItemService _todoItemService;
    private readonly ICurrentUserService _currentUserService;
    public GetTodoByUserCommandHandler(DataContext context,ICurrentUserService currentUserService ,ITodoItemService todoItemService, IMapper mapper)
    {
        _context = context;
        _mapper = mapper;
        _todoItemService = todoItemService;
        _currentUserService = currentUserService;
    }
    public async Task<Result> Handle(GetTodoByUserCommand request, CancellationToken cancellationToken)
    {  
        if(_currentUserService.UserId == null)
        {
            throw new UnauthorizedAccessException();
        }
        IList<TodoItem> entities =   await  _todoItemService.GetByUserId(_currentUserService.UserId);
        BaseReponse reponse = new BaseReponse {
            Message = "Query Success!",
            Data = entities
        };
        return Result.Success(reponse);
    }
}