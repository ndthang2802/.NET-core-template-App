
using MediatR;
using AutoMapper;
using System.Net;
using FluentValidation;
using Microsoft.EntityFrameworkCore;
using StartFromScratch.Models;
using StartFromScratch.Entities;
using StartFromScratch.Services;
using StartFromScratch.Mappings;

namespace StartFromScratch.Usecases.Categories.Commands;
public record UpdateCategoryCommand : IRequest<Result>, IMapTo<Category>
{
    public int Id {get; init;}
    public string? Code { get; init; }
    public string? DisplayName { get; init; }
    public string? Description { get; init; }
    public int? ParentId {get;init;}

    public void Mapping(Profile profile)
    {
        profile.CreateMap<UpdateCategoryCommand, Category>()
                .ForMember(d => d.Code, opt => {
                        opt.Condition(src => !string.IsNullOrEmpty(src.Code)) ;
                        opt.MapFrom(s =>  s.Code );
                    })
                .ForMember(d => d.Description, opt => {
                        opt.Condition(src => !string.IsNullOrEmpty(src.Description)) ;
                        opt.MapFrom(s =>  s.Description);
                    })
                .ForMember(d => d.DisplayName, opt => {
                        opt.Condition(src => !string.IsNullOrEmpty(src.DisplayName)) ;
                        opt.MapFrom(s =>  s.DisplayName);
                    })
                .ForMember(d => d.ParentId, opt => {
                        opt.Condition(src => src.ParentId != null) ;
                        opt.MapFrom(s =>  s.ParentId );
                    });
    }
}
public class UpdateCategoryCommandValidator : AbstractValidator<UpdateCategoryCommand>
{
    private readonly DataContext _context;

    public UpdateCategoryCommandValidator(DataContext context)
    {
        _context = context;
        When(v => v.Code is not null, () => {
            RuleFor(v => v.Code)
            .NotEmpty().NotNull().WithMessage("Category Code is required.")
            .MaximumLength(20).WithMessage("Category Code must not exceed 30 characters.")
            .MustAsync((model, code, cancellation) => BeUniqueCategoryCode(code, model.Id, cancellation)).WithMessage("The specified Category code already exists.");
        });
        When(v => v.Description is not null, () => {
            RuleFor(v => v.Description)
            .NotEmpty().NotNull().WithMessage("Description is required.")
            .MaximumLength(150).WithMessage("Description must not exceed 150 characters.");
        });
        
    }
    public async Task<bool> BeUniqueCategoryCode(string Code, int id, CancellationToken cancellationToken)
    {
        bool res = await _context.Categories
            .AllAsync(l => l.Id != id ? l.Code != Code : true, cancellationToken);
        Console.WriteLine(res);
        return res;
    }
}


public class UpdateCategoryCommandHandler : IRequestHandler<UpdateCategoryCommand, Result>
{
    private readonly IMapper _mapper ;
    private readonly ICategoryService _CategoryService;
    private readonly ICurrentUserService _currentUserService;
    private readonly IUserService _userService;

    public UpdateCategoryCommandHandler(ICategoryService CategoryService,ICurrentUserService currentUserService,IUserService UserService, IMapper mapper)
    {
        _mapper = mapper;
        _CategoryService = CategoryService;
        _currentUserService = currentUserService;
        _userService = UserService;
    }

    public async Task<Result> Handle(UpdateCategoryCommand request, CancellationToken cancellationToken)
    {
        Category? CategoryToUpdate = await _CategoryService.GetById(request.Id);
        if (CategoryToUpdate == null)
        {
            return Result.ItemNotFound();
        }
        _mapper.Map<UpdateCategoryCommand,Category>(request , CategoryToUpdate);
        bool succeeded = await  _CategoryService.UpdateAndSave(CategoryToUpdate);
        if (succeeded)
        {
            BaseReponse reponse = new BaseReponse {
                Message = "Update Category Success!",
                Data = CategoryToUpdate
            };
            return Result.Success(reponse);
        }
        else {
            return Result.Failure(HttpStatusCode.BadRequest, new string [] {"Add Category Fails"});
        }
    }
}