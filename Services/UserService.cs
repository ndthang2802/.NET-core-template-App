using StartFromScratch.Models;
using StartFromScratch.Entities;
using StartFromScratch.Authorization;
using Microsoft.EntityFrameworkCore;
namespace StartFromScratch.Services;
public interface IUserService : IBaseService<User>
{
    public Task<object?> Authenticate(string username, string password);
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
    public async Task<object?> Authenticate(string username, string password)
    {
        var user = await _context.Users.FirstOrDefaultAsync(x => x.Username == username, new CancellationToken());
        if (user == null || !BCrypt.Net.BCrypt.Verify(password, user.PasswordHash))
            return null;
        var jwtToken = _jwtUtil.GenerateToken(user);
        return  new { access_token = jwtToken, user = user };
    }
}