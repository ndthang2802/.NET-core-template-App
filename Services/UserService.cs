using StartFromScratch.Models;
using StartFromScratch.Entities;
using StartFromScratch.Authorization;
using Microsoft.EntityFrameworkCore;

namespace StartFromScratch.Services;
public interface IUserService : IBaseService<User>
{
    public Task<LoginResponse?> Authenticate(string username, string password);
    public Task<List<Policy>> GetPoliciesOfUser(User user);
}
public record LoginResponse {
    public User user {get;set;} = new User();
    public string access_token {get;set;} = "";
}
public class UserService :  BaseService<User>, IUserService
{
    private DataContext _context;
    private IJwtUtil _jwtUtil;
    public UserService(DataContext context, IJwtUtil jwtUtil) : base (context)
    {
        _context = context;
        _jwtUtil = jwtUtil;
    }
    public async Task<LoginResponse?> Authenticate(string username, string password)
    {
        var user = await _context.Users.FirstOrDefaultAsync(x => x.Username == username, new CancellationToken());
        if (user == null || !BCrypt.Net.BCrypt.Verify(password, user.PasswordHash))
            return null;
        var jwtToken = _jwtUtil.GenerateToken(user);
        return  new LoginResponse { access_token = jwtToken, user = user };
    }
    public async Task<List<Policy>> GetPoliciesOfUser(User user)
    {
        List<string> user_roles = user.Roles.Split(",").ToList();
        if (user_roles.Count() == 0)
            return new List<Policy>();
        IList<Role> user_rolesList = await _context.Roles.Where(x => x.Code != null ? user_roles.Contains(x.Code) : false).ToListAsync( new CancellationToken());
        List<Policy> res = new List<Policy>();
        for (int i = 0; i < user_rolesList.Count(); i ++)
        {
            res.Concat(user_rolesList[i].PoliciesList ??  new List<Policy>());
        }
        return new HashSet<Policy>(res).ToList();
    }
}