using StartFromScratch.Services;
namespace StartFromScratch.Authorization;
public class JwtMiddleWare 
{
    private readonly RequestDelegate _next ;
    public JwtMiddleWare (RequestDelegate next)
    {
        _next = next;
    }
    public async Task Invoke (HttpContext _context, IUserService _userService, IJwtUtil _jwtUtils)
    {
        var access_token = _context.Request.Headers["Authorization"].FirstOrDefault()?.Split(" ").Last(); // token is `Bearer tokenstring`
        
        // determine user here
        if (!string.IsNullOrEmpty(access_token))
        {
            var userID = _jwtUtils.ValidationAndGetUserIdFromToken(access_token);
            if (userID != null )
            {
                var User = await _userService.GetById(userID.Value);
                if(User != null)
                {
                    User.Policies = await _userService.GetPoliciesOfUser(User);
                }
                _context.Items["User"] = User;
            }
        }
        await _next(_context);

    }
}