using StartFromScratch.Models;
using Microsoft.EntityFrameworkCore;
using System.Linq;
namespace StartFromScratch.Services;
public interface IBaseService<T> where T : class
{
    public  Task<bool> AddAsync (T entity);
    public  Task<bool> Update (T entity);
    public  Task<bool> Remove (T entity);
    public  Task<T?> GetById (int Id);
    public  Task<IList<T>> GetAll ();


}
public class BaseService<T>: IBaseService<T> where T : class 
{
    private readonly DataContext _context ;
    public BaseService(DataContext context)
    {
        _context = context;
    }
    public async Task<bool> AddAsync (T entity)
    {
        await _context.Set<T>().AddAsync(entity);
        int result = await _context.SaveChangesAsync(new CancellationToken());
        return result > 0;
    }
    public async Task<bool> Update (T entity)
    {
        _context.Set<T>().Update(entity);
        int result = await _context.SaveChangesAsync(new CancellationToken());
        return result > 0;
    }
    public async Task<bool> Remove (T entity)
    {
        _context.Set<T>().Remove(entity);
        int result = await _context.SaveChangesAsync(new CancellationToken());
        return result > 0;
    }
    public async Task<T?> GetById (int Id)
    {
        return await _context.Set<T>().FindAsync(Id);
    }
    public async Task<IList<T>> GetAll ()
    {
        return await _context.Set<T>().ToListAsync(new CancellationToken());
    }
}