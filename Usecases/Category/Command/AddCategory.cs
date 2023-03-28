
using MediatR;
using AutoMapper;
using System.Net;
using FluentValidation;
using StartFromScratch.Models;
using StartFromScratch.Entities;
using StartFromScratch.Services;
using StartFromScratch.Mappings;
using StartFromScratch.Events;
using Microsoft.EntityFrameworkCore;

namespace StartFromScratch.Usecases.Categories.Commands;
public record AddCategoryCommand : IRequest<Result>, IMapTo<Category>
{
    public string? Code {get;set;}
    public string? DisplayName {get;set;}
    public string? Description {get;set;}
    public int? ParentId {get;set;}
    public string? IconURL {get;set;}
    public void Mapping(Profile profile)
    {
        profile.CreateMap<AddCategoryCommand, Category>();
    }
}
public class AddCategoryCommandValidator : AbstractValidator<AddCategoryCommand>
{
    private readonly DataContext _context;

    public AddCategoryCommandValidator(DataContext context)
    {
        _context = context;

        RuleFor(v => v.Code)
            .NotEmpty().NotNull().WithMessage("Image of Category can not be empty.")
            .MaximumLength(20).WithMessage("Category Code must not exceed 30 characters.")
            .MustAsync(BeUniqueCategoryCode).WithMessage("The specified Role code already exists.");
        RuleFor(v => v.DisplayName)
            .NotEmpty().NotNull().WithMessage("Name of Category can not be empty.");
        RuleFor(v => v.Description)
            .NotEmpty().NotNull().WithMessage("Description of Category can not be empty.");
        When(v => v.ParentId is not null && v.ParentId != 0, () => {
            RuleFor(v => v.ParentId)
                .NotEmpty().NotNull().WithMessage("Parent of category of Categorys can not be empty.")
                .MustAsync(BeParentCategoryExist).WithMessage("Parent of category not exist.");
        }); 
    }

    public async Task<bool> BeUniqueCategoryCode(string Code, CancellationToken cancellationToken)
    {
        return await _context.Categories
            .AllAsync(l => l.Code != Code, cancellationToken);
    }
    public async Task<bool> BeParentCategoryExist(int? parentId, CancellationToken cancellationToken)
    {
        var parent = await _context.Categories.FirstOrDefaultAsync(l => l.Id == parentId, cancellationToken);
        return parent != null;
    }
}


public class AddCategoryCommandHandler : IRequestHandler<AddCategoryCommand, Result>
{
    private readonly IMapper _mapper ;
    private readonly ICategoryService _CategoryService;
    private readonly ICurrentUserService _currentUserService;


    public AddCategoryCommandHandler(ICategoryService CategoryService,ICurrentUserService currentUserService, IMapper mapper)
    {
        _mapper = mapper;
        _CategoryService = CategoryService;
        _currentUserService = currentUserService;
    }

    public async Task<Result> Handle(AddCategoryCommand request, CancellationToken cancellationToken)
    {
        Category entity =  _mapper.Map<AddCategoryCommand,Category>(request);
        bool succeeded = await  _CategoryService.AddAsync(entity);
        if (succeeded)
        {
            BaseReponse reponse = new BaseReponse {
                Message = "Add Category Success!",
                Data = entity
            };
            return Result.Success(reponse);
        }
        else {
            return Result.Failure(HttpStatusCode.BadRequest, new string [] {"Category Fails"});
        }
    }
}