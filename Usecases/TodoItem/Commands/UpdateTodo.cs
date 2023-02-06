 
using MediatR;
using AutoMapper;
using System.Net;
using FluentValidation;
using Microsoft.EntityFrameworkCore;
using StartFromScratch.Models;
using StartFromScratch.Entities;
using StartFromScratch.Services;
using StartFromScratch.Mappings;
namespace StartFromScratch.Usecases.TodoItems.Commands;
public enum UpdateTodoType {
    UpdateInfomation,
    MakeAsDone
}
public record UpdateTodoItemCommand : IRequest<Result>, IMapTo<User>
{
    public UpdateTodoType? Type {get; init;}
    public int Id {get;init;}
    public string? Title { get; init; }
    public int? Priority { get; init; }
    public  DateTime? Reminder { get; init; }
    public string? Note { get; init; }

    public void Mapping(Profile profile)
    {
        profile.CreateMap<UpdateTodoItemCommand, TodoItem>();
    }
}
public class UpdateTodoItemCommandValidator : AbstractValidator<UpdateTodoItemCommand>
{
    private readonly DataContext _context;

    public UpdateTodoItemCommandValidator(DataContext context)
    {
        _context = context;

        RuleFor(v => v.Type)
            .NotEmpty().NotNull().WithMessage("Type is required.");
        RuleFor(v => v.Id)
            .NotEmpty().NotNull().WithMessage("Id is required.");
        When(v => v.Type == UpdateTodoType.UpdateInfomation, () => { 
            RuleFor(v => v.Title)
                .NotEmpty().NotNull().WithMessage("Title is required.")
                .MaximumLength(200).WithMessage("Username must not exceed 200 characters.");
            RuleFor(v => v.Note)
                .NotEmpty().NotNull().WithMessage("Note is required.")
                .MaximumLength(200).WithMessage("Username must not exceed 200 characters.");
            RuleFor(v => v.Reminder)
                .NotEmpty().NotNull().WithMessage("Reminder is required."); 
        });
    }
}


public class UpdateTodoItemCommandHandler : IRequestHandler<UpdateTodoItemCommand, Result>
{
    private readonly IMapper _mapper ;
    private readonly ITodoItemService _todoItemService;

    public UpdateTodoItemCommandHandler(ITodoItemService todoItemService, IMapper mapper)
    {
        _mapper = mapper;
        _todoItemService = todoItemService;
    }

    public async Task<Result> Handle(UpdateTodoItemCommand request, CancellationToken cancellationToken)
    {
        
        TodoItem? entity =  await _todoItemService.GetById(request.Id);
        if (entity == null )
        {
            return Result.ItemNotFound();
        }
        bool succeeded = false;
        switch (request.Type) {
            case UpdateTodoType.UpdateInfomation :
                _mapper.Map<UpdateTodoItemCommand,TodoItem>(request, entity);
                succeeded = await  _todoItemService.Update(entity);
                if (succeeded)
                {
                    BaseReponse reponse = new BaseReponse {
                        Message = "Add Todo item Success!",
                        Responses = entity
                    };
                    return Result.Success(reponse);
                }
                else {
                    return Result.Failure(HttpStatusCode.BadRequest, new string [] {"Add user Fails"});
                }
            case UpdateTodoType.MakeAsDone :
                entity.Done = true;
                succeeded = await  _todoItemService.Update(entity);
                if (succeeded)
                {
                    BaseReponse reponse = new BaseReponse {
                        Message = "Add Todo item Success!",
                        Responses = entity
                    };
                    return Result.Success(reponse);
                }
                else {
                    return Result.Failure(HttpStatusCode.BadRequest, new string [] {"Add user Fails"});
                }
            default:
                    return Result.UnKnownRequest();
        }
        
    }
}