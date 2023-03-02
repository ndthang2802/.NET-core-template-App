
using MediatR;
using AutoMapper;
using System.Net;
using FluentValidation;
using StartFromScratch.Models;
using StartFromScratch.Entities;
using StartFromScratch.Services;
using StartFromScratch.Mappings;
using StartFromScratch.Events;
namespace StartFromScratch.Usecases.Products.Commands;
public record AddProductCommand : IRequest<Result>, IMapTo<Product>
{
    public string? Base64Image {get;set;}
    public string? Name {get;set;}
    public string? Description {get;set;}
    public Currency? Currency {get; set;} 
    public float SellPrice {get;set;}
    public float InStock {get;set;}
    public bool Display {get;set;}
    public void Mapping(Profile profile)
    {
        profile.CreateMap<AddProductCommand, Product>();
    }
}
public class AddProductCommandValidator : AbstractValidator<AddProductCommand>
{
    private readonly DataContext _context;

    public AddProductCommandValidator(DataContext context)
    {
        _context = context;

        RuleFor(v => v.Base64Image).NotEmpty().NotNull().WithMessage("Image of products can not be empty.");
        RuleFor(v => v.Name).NotEmpty().NotNull().WithMessage("Name of products can not be empty.");
        RuleFor(v => v.Description).NotEmpty().NotNull().WithMessage("Description of products can not be empty.");
        RuleFor(v => v.SellPrice).NotEmpty().NotNull().WithMessage("Sell Price of products can not be empty.");
        RuleFor(v => v.Currency).NotEmpty().NotNull().WithMessage("Currency of products can not be empty.");
        RuleFor(v => v.InStock).NotEmpty().NotNull().WithMessage("In stock number of products can not be empty.");
        RuleFor(v => v.Display).NotEmpty().NotNull().WithMessage("Display option of products can not be empty.");
    }
}


public class AddProductCommandHandler : IRequestHandler<AddProductCommand, Result>
{
    private readonly IMapper _mapper ;
    private readonly IProductService _ProductService;
    private readonly ICurrentUserService _currentUserService;


    public AddProductCommandHandler(IProductService ProductService,ICurrentUserService currentUserService, IMapper mapper)
    {
        _mapper = mapper;
        _ProductService = ProductService;
        _currentUserService = currentUserService;
    }

    public async Task<Result> Handle(AddProductCommand request, CancellationToken cancellationToken)
    {
        Product entity =  _mapper.Map<AddProductCommand,Product>(request);
        entity.Code = "PROD" + DateTime.UtcNow.ToString(); 
        bool succeeded = await  _ProductService.AddAsync(entity);
        if (succeeded)
        {
            BaseReponse reponse = new BaseReponse {
                Message = "Add Product Success!",
                Data = entity
            };
            return Result.Success(reponse);
        }
        else {
            return Result.Failure(HttpStatusCode.BadRequest, new string [] {"Product Fails"});
        }
    }
}