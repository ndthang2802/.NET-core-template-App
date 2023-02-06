using StartFromScratch.Models;
using StartFromScratch.Entities;
using StartFromScratch.Authorization;
using Microsoft.EntityFrameworkCore;
namespace StartFromScratch.Services;
public interface IRoleService : IBaseService<Role>
{
    public Task <IList<Role>> GetByCodes (string[] codes);
}
public class RoleService :  BaseService<Role>, IRoleService
{
    private DataContext _context;
    public RoleService(DataContext context) : base (context)
    {
        _context = context;
    }
    public async Task <IList<Role>> GetByCodes (string[] codes)
    {
        return await _context.Roles.Where(x => codes.Contains(x.Code)).ToListAsync(new CancellationToken());
    }
}