using StartFromScratch.Models;
using StartFromScratch.Entities;
using StartFromScratch.Authorization;
using Microsoft.EntityFrameworkCore;
using StartFromScratch.Mappings;
using System.IO;
namespace StartFromScratch.Services;
public interface IProductService : IBaseService<Product>
{
    public Task<PaginatedList<Product>> GetWithPagination (int PageNumber, int PageSize);
    public Task<bool> DeleteProduct (string imageDir,Product product);
}
public class ProductService :  BaseService<Product>, IProductService
{
    private DataContext _context;
    public ProductService(DataContext context ) : base (context)
    {
        _context = context;
    }

    public async Task<PaginatedList<Product>> GetWithPagination (int PageNumber, int PageSize)
    {
        return await _context.Products.OrderBy(x => x.NumberSoldCount).OrderBy(x => x.Created)
                                .PaginatedListAsync(PageNumber, PageSize);
    }

    public async Task<bool> DeleteProduct (string imageDir,Product product)
    {
        try {
            if(!String.IsNullOrEmpty(product.ImagesName))
            {
                foreach (string file in product.ImagesName.Split(";"))
                {
                    File.Delete(imageDir + file);
                }
            }
            _context.Remove(product);
            int result = await _context.SaveChangesAsync(new CancellationToken());
            return result > 0;
        }
        catch {
            return false;
        }
    }
}