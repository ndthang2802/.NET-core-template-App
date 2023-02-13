using StartFromScratch.Models;
using StartFromScratch.Entities;
using StartFromScratch.Authorization;
using Microsoft.EntityFrameworkCore;
using StartFromScratch.Mappings;

namespace StartFromScratch.Services;
public interface IProductService : IBaseService<Product>
{
    public Task<PaginatedList<Product>> GetWithPagination (int PageNumber, int PageSize);
}
public class ProductService :  BaseService<Product>, IProductService
{
    private DataContext _context;
    public ProductService(DataContext context) : base (context)
    {
        _context = context;
    }

    public async Task<PaginatedList<Product>> GetWithPagination (int PageNumber, int PageSize)
    {
        return await _context.Products.OrderBy(x => x.NumberSoldCount).OrderBy(x => x.Created)
                                .PaginatedListAsync(PageNumber, PageSize);
    }
}