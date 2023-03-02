
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
public enum VerifyType 
{
    ACCEPT,
    DENY
}
public record VerifyOrderCommand : IRequest<Result>
{
    public int OrderId { get; init; } 
    public VerifyType Type {get;init;}
}
public class VerifyOrderCommandValidator : AbstractValidator<VerifyOrderCommand>
{
    private readonly DataContext _context;

    public VerifyOrderCommandValidator(DataContext context)
    {
        _context = context;

        RuleFor(v => v.OrderId).NotEmpty().NotNull().WithMessage("Order ID is required.");
        RuleFor(v => v.Type).NotEmpty().NotNull().WithMessage("Verify type is required.");
    }
}


public class VerifyOrderCommandHandler : IRequestHandler<VerifyOrderCommand, Result>
{
    private readonly IMapper _mapper ;
    private readonly IOrderService _OrderService;
    private readonly ICurrentUserService _currentUserService;


    public VerifyOrderCommandHandler(IOrderService OrderService,ICurrentUserService currentUserService, IMapper mapper)
    {
        _mapper = mapper;
        _OrderService = OrderService;
        _currentUserService = currentUserService;
    }

    public async Task<Result> Handle(VerifyOrderCommand request, CancellationToken cancellationToken)
    {
        Order? _order_to_verify = await _OrderService.GetById(request.OrderId);
        if (_order_to_verify == null)
        {
            return Result.ItemNotFound();
        }
        switch (request.Type)
        {
            case VerifyType.ACCEPT :
                _order_to_verify.VerifyStatus = AdminVerifyStatus.ACCEPTED;
                _order_to_verify.CanbeEdit = false;
                break;
            case VerifyType.DENY :
                _order_to_verify.VerifyStatus = AdminVerifyStatus.DENIED;
                _order_to_verify.CanbeEdit = false;
                break;
        }

        bool succeeded = await _OrderService.UpdateAndSave(_order_to_verify);
        if (succeeded)
        {
            BaseReponse reponse = new BaseReponse {
                Message = "Verify Order Success!",
                Data = _order_to_verify
            };
            return Result.Success(reponse);
        }
        else {
            return Result.Failure(HttpStatusCode.BadRequest, new string [] {"Verify Order Fails"});
        }
    }
}