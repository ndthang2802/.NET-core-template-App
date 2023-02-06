using System.Security.Claims;
using StartFromScratch.Entities;

namespace StartFromScratch.Services;
public interface ICurrentUserService
{
    int? UserId { get; }
    string? Roles {get; }
    User? User {get;}
    public bool IsCurrentUserHaveGreaterRole (IList<Role> request, IList<Role> current);
    public bool IsCurrentUserCanEdit(int targetId);
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

    public bool IsCurrentUserHaveGreaterRole (IList<Role> request, IList<Role> current)
    {
        return request.All(x => current.Contains(x) ||   current.Any(c => c.Level >= x.Level ));
    }
    public bool IsCurrentUserCanEdit(int targetId)
    {
        User? _user = ((User?)_httpContextAccessor.HttpContext?.Items["User"]);
        return _user != null && ( _user.Id == targetId );
    }

    
}