 
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
public record AddTodoItemCommand : IRequest<Result>, IMapTo<User>
{
    public string? Title { get; init; }
    public int? Priority { get; init; }
    public  DateTime? Reminder { get; init; }
    public string? Note { get; init; }
    public bool Done { get; init; }

    public void Mapping(Profile profile)
    {
        profile.CreateMap<AddTodoItemCommand, TodoItem>();
    }
}
public class AddTodoItemCommandValidator : AbstractValidator<AddTodoItemCommand>
{
    private readonly DataContext _context;

    public AddTodoItemCommandValidator(DataContext context)
    {
        _context = context;

        RuleFor(v => v.Title)
            .NotEmpty().NotNull().WithMessage("Title is required.")
            .MaximumLength(200).WithMessage("Username must not exceed 200 characters.");
        RuleFor(v => v.Note)
            .NotEmpty().NotNull().WithMessage("Note is required.")
            .MaximumLength(200).WithMessage("Username must not exceed 200 characters."); 
        RuleFor(v => v.Reminder)
            .NotEmpty().NotNull().WithMessage("Reminder is required."); 
    }
}


public class AddTodoItemCommandHandler : IRequestHandler<AddTodoItemCommand, Result>
{
    private readonly IMapper _mapper ;
    private readonly ITodoItemService _todoItemService;

    public AddTodoItemCommandHandler(ITodoItemService todoItemService, IMapper mapper)
    {
        _mapper = mapper;
        _todoItemService = todoItemService;
    }

    public async Task<Result> Handle(AddTodoItemCommand request, CancellationToken cancellationToken)
    {
        
        TodoItem entity =  _mapper.Map<AddTodoItemCommand,TodoItem>(request);
        bool succeeded = await  _todoItemService.AddAsync(entity);
        if (succeeded)
        {
            BaseReponse reponse = new BaseReponse {
                Message = "Add Todo item Success!",
                Data = entity
            };
            return Result.Success(reponse);
        }
        else {
            return Result.Failure(HttpStatusCode.BadRequest, new string [] {"Add user Fails"});
        }
    }
}