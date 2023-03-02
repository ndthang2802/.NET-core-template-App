
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
public record DeleteProductCommand : IRequest<Result>, IMapTo<Product>
{
    public int ProductId {get;set;}
}

public class DeleteProductCommandHandler : IRequestHandler<DeleteProductCommand, Result>
{
    private readonly IMapper _mapper ;
    private readonly IProductService _ProductService;

    public DeleteProductCommandHandler(IProductService ProductService, IMapper mapper)
    {
        _mapper = mapper;
        _ProductService = ProductService;
    }

    public async Task<Result> Handle(DeleteProductCommand request, CancellationToken cancellationToken)
    {
        Product? entity =  await _ProductService.GetById(request.ProductId);
        if (entity == null)
        {
            return Result.ItemNotFound();
        } 
        bool succeeded = await  _ProductService.DeleteAndSave(entity);
        if (succeeded)
        {
            BaseReponse reponse = new BaseReponse {
                Message = "Delete Product Success!",
                Data = entity
            };
            return Result.Success(reponse);
        }
        else {
            return Result.Failure(HttpStatusCode.BadRequest, new string [] {"Product Fails"});
        }
    }
}