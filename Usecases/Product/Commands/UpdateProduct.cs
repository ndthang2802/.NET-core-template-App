
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
public record UpdateProductCommand : IRequest<Result>, IMapTo<Product>
{
    public int ProductId {get;set;}
    public string? Base64Image {get;set;}
    public string? Name {get;set;}
    public string? Description {get;set;}
    public Currency? Currency {get; set;} 
    public float SellPrice {get;set;}
    public float InStock {get;set;}
    public bool Display {get;set;}
    public void Mapping(Profile profile)
    {
        profile.CreateMap<UpdateProductCommand, Product>();
    }
}
public class UpdateProductCommandValidator : AbstractValidator<UpdateProductCommand>
{
    public UpdateProductCommandValidator()
    {
        
    }
}


public class UpdateProductCommandHandler : IRequestHandler<UpdateProductCommand, Result>
{
    private readonly IMapper _mapper ;
    private readonly IProductService _ProductService;
    private readonly ICurrentUserService _currentUserService;


    public UpdateProductCommandHandler(IProductService ProductService,ICurrentUserService currentUserService, IMapper mapper)
    {
        _mapper = mapper;
        _ProductService = ProductService;
        _currentUserService = currentUserService;
    }

    public async Task<Result> Handle(UpdateProductCommand request, CancellationToken cancellationToken)
    {
        Product? entity =  await _ProductService.GetById(request.ProductId);
        if (entity == null)
        {
            return Result.ItemNotFound();
        }
        _mapper.Map<UpdateProductCommand,Product>(request, entity);
        bool succeeded = await  _ProductService.UpdateAndSave(entity);
        if (succeeded)
        {
            BaseReponse reponse = new BaseReponse {
                Message = "Update Product Success!",
                Responses = entity
            };
            return Result.Success(reponse);
        }
        else {
            return Result.Failure(HttpStatusCode.BadRequest, new string [] {"Product Fails"});
        }
    }
}