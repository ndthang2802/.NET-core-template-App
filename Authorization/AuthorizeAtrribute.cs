using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;
using StartFromScratch.Entities;

public class AuthorizeAttribute : Attribute, IAuthorizationFilter
{
    private readonly IList<string> _roles;
    public AuthorizeAttribute (params string[] roles)
    {
        _roles = roles ?? new string[] {};
    }
    private bool ContainsRoles(IList<string> Roles, string[] RolesToContain)
    {
        foreach(string role in RolesToContain)
        {
            if (Roles.Contains(role))
            {
                return true;
            }
        }
        return false;
    }
    public void OnAuthorization(AuthorizationFilterContext context)
    {
        var allowAnonymous = context.ActionDescriptor.EndpointMetadata.OfType<AllowAnonymousAttribute>().Any();
        if (allowAnonymous)
            return;
        var user = context.HttpContext.Items["User"];
        if (user == null )
        {
            var details = new ProblemDetails
            {
                Status = StatusCodes.Status401Unauthorized,
                Title = "Unauthorized",
                Type = "https://tools.ietf.org/html/rfc7235#section-3.1"
            };

            context.Result = new ObjectResult(details)
            {
                StatusCode = StatusCodes.Status401Unauthorized
            };
        }
        else if (_roles.Any() && !ContainsRoles(_roles,((User)user).Roles.Split(",")))
        {
            // role not authorized
            var details = new ProblemDetails
            {
                Status = StatusCodes.Status403Forbidden,
                Title = "Forbidden",
                Type = "https://tools.ietf.org/html/rfc7231#section-6.5.3"
            };

            context.Result = new ObjectResult(details)
            {
                StatusCode = StatusCodes.Status403Forbidden
            };
        }
    }
}