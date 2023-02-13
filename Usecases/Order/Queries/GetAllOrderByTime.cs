using MediatR;
using AutoMapper;
using StartFromScratch.Models;
using StartFromScratch.Entities;
using StartFromScratch.Services;
namespace StartFromScratch.Usecases.Orders.Queries;
public record GetAllOrdersByTimeCommand : IRequest<Result>
{
    public DateTime FromDate {get;init;}
    public DateTime ToDate {get;init;}

}
public class GetAllOrdersByTimeCommandHandler : IRequestHandler<GetAllOrdersByTimeCommand, Result>
{
    private readonly IOrderService _Orderservice;
    public GetAllOrdersByTimeCommandHandler(IOrderService Orderservice)
    {
        _Orderservice = Orderservice;
    }
    public async Task<Result> Handle(GetAllOrdersByTimeCommand request, CancellationToken cancellationToken)
    {  
        IList<Order> entities =   await  _Orderservice.GetAllOrderByTime(request.FromDate, request.ToDate);
        BaseReponse reponse = new BaseReponse {
            Message = "Query Success!",
            Responses = entities
        };
        return Result.Success(reponse);
    }
}