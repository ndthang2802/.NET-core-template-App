
using MediatR;
using AutoMapper;
using System.Net;
using FluentValidation;
using StartFromScratch.Models;
using StartFromScratch.Entities;
using StartFromScratch.Services;
using StartFromScratch.Mappings;
using StartFromScratch.Events;
namespace StartFromScratch.Usecases.Orders.Commands;
public record OrderItem
{
    public int ProductId {get; init;}
    public int Quantity {get; init;}

}
public record AddOrderCommand : IRequest<Result>, IMapTo<Order>
{
    public IList<OrderItem> Products { get; init; } = new List<OrderItem>();
    public void Mapping(Profile profile)
    {
        profile.CreateMap<AddOrderCommand, Order>()
        .ForMember(d => d.ProductIds, opt => opt.MapFrom(c =>  string.Join( "," , c.Products.Select(x => x.ProductId.ToString()).ToArray())))
        .ForMember(d => d.Quantities, opt => opt.MapFrom(c =>  string.Join( "," , c.Products.Select(x => x.Quantity.ToString()).ToArray())));
    }
}
public class AddOrderCommandValidator : AbstractValidator<AddOrderCommand>
{
    private readonly DataContext _context;

    public AddOrderCommandValidator(DataContext context)
    {
        _context = context;

        RuleFor(v => v.Products)
            .NotEmpty().NotNull().WithMessage("List products can not be empty.");
        RuleFor(v => v.Products).ForEach(product =>
            {
                product.ChildRules(orderitem => {
                    orderitem.RuleFor(o => o.ProductId).NotEmpty().NotNull().WithMessage("Products id can not be empty.");
                    orderitem.RuleFor(o => o.Quantity).NotEmpty().NotNull().WithMessage("Quantity can not be empty.");
                });
            }
        );
            
    }
}


public class AddOrderCommandHandler : IRequestHandler<AddOrderCommand, Result>
{
    private readonly IMapper _mapper ;
    private readonly IOrderService _OrderService;
    private readonly ICurrentUserService _currentUserService;


    public AddOrderCommandHandler(IOrderService OrderService,ICurrentUserService currentUserService, IMapper mapper)
    {
        _mapper = mapper;
        _OrderService = OrderService;
        _currentUserService = currentUserService;
    }

    public async Task<Result> Handle(AddOrderCommand request, CancellationToken cancellationToken)
    {
        IList<int> productsId = request.Products.Select(x => x.ProductId).ToArray();
        IList<Product> products = await _OrderService.GetListProductByIds(productsId);
        if(products == null || products.Count() != productsId.Count() || products.Count() <= 0)
        {
            return Result.ItemNotFound();
        }
        IList<int> productsQuantites = request.Products.Select(x => x.Quantity).ToArray();
        Order entity =  _mapper.Map<AddOrderCommand,Order>(request);
        entity.Code = _currentUserService.UserId.ToString() ?? "" + "ORDERCREATE" + DateTime.UtcNow.ToString(); 
        entity.TotalPrice = products.Select((p,i) => p.SellPrice * productsQuantites[i]).Sum();
        entity.AddDomainEvent(new OrderCreatedEvent(entity, products));
        bool succeeded = await  _OrderService.AddAsync(entity);
        if (succeeded)
        {
            BaseReponse reponse = new BaseReponse {
                Message = "Add Order Success!",
                Data = entity
            };
            return Result.Success(reponse);
        }
        else {
            return Result.Failure(HttpStatusCode.BadRequest, new string [] {"Order Fails"});
        }
    }
}