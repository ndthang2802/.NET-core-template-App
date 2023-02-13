using StartFromScratch.Models;
using Microsoft.EntityFrameworkCore;
using System.Linq;
namespace StartFromScratch.Services;
public interface IBaseService<T> where T : class
{
    public  Task<bool> AddAsync (T entity);
    public  Task<bool> AddRangeAsync (IList<T> entity);

    public  Task<bool> UpdateAndSave (T entity);
    public void Update(T entity);
    public Task<bool> SaveChangesAsync ();
    public  Task<bool> Remove (T entity);
    public  Task<T?> GetById (int Id);
    public  Task<IList<T>> GetAll ();
    public void Delete (T entity);
    public Task<bool> DeleteAndSave(T entity);
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
    public async Task<bool> AddRangeAsync (IList<T> entity)
    {
        await _context.Set<T>().AddRangeAsync(entity);
        int result = await _context.SaveChangesAsync(new CancellationToken());
        return result > 0;
    }
    public async Task<bool> UpdateAndSave (T entity)
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
    public void  Update (T entity)
    {
        _context.Set<T>().Update(entity);;
    }
    public void Delete (T entity)
    {
        _context.Set<T>().Remove(entity);
    }
    public async Task<bool> DeleteAndSave(T entity)
    {
        _context.Set<T>().Remove(entity);
        int result = await _context.SaveChangesAsync(new CancellationToken());
        return result > 0;
    }
    public async Task<bool> SaveChangesAsync ()
    {
        int result = await _context.SaveChangesAsync(new CancellationToken());
        return result > 0;
    }
}