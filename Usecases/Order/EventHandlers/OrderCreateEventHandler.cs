using StartFromScratch.Events;
using MediatR;
using Microsoft.Extensions.Logging;
using StartFromScratch.Services;
using StartFromScratch.Entities;

namespace StartFromScratch.Usecases.Orders.EventHandlers;

public class OrderCreatedEventHandler : INotificationHandler<OrderCreatedEvent>
{
    private readonly ILogger<OrderCreatedEventHandler> _logger;
    private readonly IProductService _productService;

    public OrderCreatedEventHandler(ILogger<OrderCreatedEventHandler> logger, IProductService productService)
    {
        _logger = logger;
        _productService = productService;
    }

    public async Task Handle(OrderCreatedEvent notification, CancellationToken cancellationToken)
    {
        IList<int>? productsId = notification._order?.ProductIds?.Split(",").Select(int.Parse).ToArray();
        IList<int>? quantities = notification._order?.Quantities?.Split(",").Select(int.Parse).ToArray();

        if (productsId != null && quantities != null)
        {
            for( int i = 0; i < productsId.Count(); i++)
            {
                Product? p = notification._products.FirstOrDefault(x => x.Id == productsId[i]);
                if (p != null)
                {
                    int quantity = quantities[i];
                    p.InStock -= quantity >= 0 ? quantity : 0;
                    p.PurchasedCount +=1;
                    p.NumberSoldCount += quantity;
                    _productService.Update(p);
                }
            }
            await _productService.SaveChangesAsync();
        }
        _logger.LogInformation("Domain Event: {DomainEvent}", notification.GetType().Name);

        await Task.CompletedTask;
    }
}
