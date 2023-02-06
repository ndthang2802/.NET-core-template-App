using StartFromScratch.Models;
using StartFromScratch.Entities;
using StartFromScratch.Authorization;
using Microsoft.EntityFrameworkCore;
namespace StartFromScratch.Services;
public interface ITodoItemService : IBaseService<TodoItem>
{
    public Task<IList<TodoItem>> GetByUserId(int? userid);
}
public class TodoItemService :  BaseService<TodoItem>, ITodoItemService
{
    private DataContext _context;
    public TodoItemService(DataContext context) : base (context)
    {
        _context = context;
    }
    public async Task<IList<TodoItem>> GetByUserId(int? userid)
    {
        return await _context.TodoItems.Where(x => x.CreatedBy  == userid).ToListAsync(new CancellationToken());
    }
}