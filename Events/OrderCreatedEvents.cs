using StartFromScratch.Common;
using StartFromScratch.Entities;
namespace StartFromScratch.Events;
public class OrderCreatedEvent : BaseEvent
{
    public OrderCreatedEvent(Order item, IList<Product> products)
    {
        _order = item;
        _products = products;
    }
    public Order _order { get; }
    public IList<Product> _products {get;}
}
