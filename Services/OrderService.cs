using StartFromScratch.Models;
using StartFromScratch.Entities;
using StartFromScratch.Authorization;
using Microsoft.EntityFrameworkCore;
namespace StartFromScratch.Services;
public interface IOrderService : IBaseService<Order>
{
    public Task<IList<Order>> GetByUserId(int? userid);
    public Task<IList<Product>> GetListProductByIds(IList<int> productIds);
    public Task<IList<Order>> GetAllOrderByTime(DateTime From, DateTime To);
    public Task<IList<Order>> GetAllOrdeByUserByTime(int? userId, DateTime From, DateTime To);
}
public class OrderService :  BaseService<Order>, IOrderService
{
    private DataContext _context;
    public OrderService(DataContext context) : base (context)
    {
        _context = context;
    }
    public async Task<IList<Order>> GetByUserId(int? userid)
    {
        return await _context.Orders.Where(x => x.CreatedBy  == userid).ToListAsync(new CancellationToken());
    }
    public async Task<IList<Product>> GetListProductByIds(IList<int> productIds)
    {
        return await _context.Products.Where(x => productIds.Contains(x.Id)).ToListAsync(new CancellationToken());
    }
    public async Task<IList<Order>> GetAllOrderByTime(DateTime From, DateTime To)
    {
        return await _context.Orders.Where(x =>   DateTime.Compare(x.Created, From) >= 0 && DateTime.Compare(x.Created, To) <= 0  ).ToListAsync(new CancellationToken());
    }
    public async Task<IList<Order>> GetAllOrdeByUserByTime(int? userId, DateTime From, DateTime To)
    {
        return await _context.Orders.Where(x =>  x.CreatedBy == userId && DateTime.Compare(x.Created, From) >= 0 && DateTime.Compare(x.Created, To) <= 0  ).ToListAsync(new CancellationToken());
    }
}