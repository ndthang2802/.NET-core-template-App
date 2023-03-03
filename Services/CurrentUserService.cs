using System.Security.Claims;
using StartFromScratch.Entities;
using Microsoft.AspNetCore.Authentication;

namespace StartFromScratch.Services;
public interface ICurrentUserService
{
    int? UserId { get; }
    string? Roles {get; }
    User? User {get;}
    public bool IsCurrentUserHaveGreaterRole (IList<Role> request, IList<Role> current);
    public bool IsCurrentUserCanEdit(int targetId);
    bool IsAdmin {get;}
    public  void HttpContextSignin(string token);
}

public class CurrentUserService : ICurrentUserService
{
    private readonly IHttpContextAccessor _httpContextAccessor;
    //private readonly User? _user ;

    public CurrentUserService(IHttpContextAccessor httpContextAccessor)
    {
        _httpContextAccessor = httpContextAccessor;
    }

    public int? UserId =>  ((User?)_httpContextAccessor.HttpContext?.Items["User"])?.Id;
    public string? Roles => ((User?)_httpContextAccessor.HttpContext?.Items["User"])?.Roles;
    public User? User => ((User?)_httpContextAccessor.HttpContext?.Items["User"]);

    public bool IsAdmin => ((User?)_httpContextAccessor.HttpContext?.Items["User"])?.Roles.Split(",").Contains("Administrator") ?? false;

    public bool IsCurrentUserHaveGreaterRole (IList<Role> request, IList<Role> current)
    {
        return request.All(x => current.Contains(x) ||   current.Any(c => c.Level >= x.Level ));
    }
    public bool IsCurrentUserCanEdit(int targetId)
    {
        User? _user = ((User?)_httpContextAccessor.HttpContext?.Items["User"]);
        return _user != null && ( _user.Id == targetId );
    }

    public void HttpContextSignin(string token){
        //var claimsIdentity = new ClaimsIdentity(claim, "Cookies");
        //var claimsPrincipal = new ClaimsPrincipal(claimsIdentity);
         if(_httpContextAccessor.HttpContext != null ){
            var cookieOptions = new Microsoft.AspNetCore.Http.CookieOptions()
            {
                HttpOnly = true, IsEssential = true, //<- there
                Expires = DateTime.Now.AddMonths(1), 
            };
            _httpContextAccessor.HttpContext.Response.Cookies.Append("X-Access-Token", token, new CookieOptions() { HttpOnly = true, SameSite = SameSiteMode.Strict });
            _httpContextAccessor.HttpContext.Response.Cookies.Append("X-Refresh-Token", token, new CookieOptions() { HttpOnly = true, SameSite = SameSiteMode.Strict });
         }

    }
}