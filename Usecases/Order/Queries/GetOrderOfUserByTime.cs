using MediatR;
using AutoMapper;
using StartFromScratch.Models;
using StartFromScratch.Entities;
using StartFromScratch.Services;
namespace StartFromScratch.Usecases.Orders.Queries;
public record GetOrdersOfUserByTimeCommand : IRequest<Result>
{
    public DateTime FromDate {get;init;}
    public DateTime ToDate {get;init;}

}
public class GetOrdersOfUserByTimeCommandHandler : IRequestHandler<GetOrdersOfUserByTimeCommand, Result>
{
    private readonly IOrderService _orderService;
    private readonly ICurrentUserService _currentUserService;
    public GetOrdersOfUserByTimeCommandHandler(IOrderService Orderservice, ICurrentUserService currentUserService)
    {
        _orderService = Orderservice;
        _currentUserService = currentUserService;
    }
    public async Task<Result> Handle(GetOrdersOfUserByTimeCommand request, CancellationToken cancellationToken)
    {  
        IList<Order> entities =   await  _orderService.GetAllOrdeByUserByTime( _currentUserService.UserId, request.FromDate, request.ToDate);
        BaseReponse reponse = new BaseReponse {
            Message = "Query Success!",
            Data = entities
        };
        return Result.Success(reponse);
    }
}