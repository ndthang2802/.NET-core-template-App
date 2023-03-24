using StartFromScratch.Models;
using StartFromScratch.Entities;
using StartFromScratch.Authorization;
using Microsoft.EntityFrameworkCore;

namespace StartFromScratch.Services;
public interface IPolicyService : IBaseService<User>
{
    public List<string> GetAllPolicies ();
    public Task<List<Policy>> GetAllPoliciesOfUser (User user);
}

public class PolicyService :  BaseService<User>, IPolicyService
{
    private DataContext _context;
    public PolicyService(DataContext context) : base (context)
    {
        _context = context;
    }
    
    public List<string> GetAllPolicies () 
    {
        return Enum.GetNames(typeof(Policy)).ToList();
    }
    public async Task<List<Policy>> GetAllPoliciesOfUser (User user)
    {
        List<Role> roles = await _context.Roles.Where(x => user.Roles.Contains(x.Code)).ToListAsync(new CancellationToken());
        if (roles.FirstOrDefault(x => x.Level == 0) != null)
        {
            return Enum.GetValues(typeof(Policy)).Cast<Policy>().ToList(); 
        }
        List<string> temp_ = string.Join(",",roles.Select(x =>   x.Policies))
                .Split(",").Distinct().ToList();
        return temp_.Select(s => (Policy) Enum.Parse(typeof(Policy), s)).ToList();
    }
}