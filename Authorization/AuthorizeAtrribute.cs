using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;
using StartFromScratch.Entities;

public class AuthorizeAttribute : Attribute, IAuthorizationFilter   // Have role or role have policy
{
    private readonly IList<string> _roles = new string[] {};
    private readonly IList<Policy> _policies =  new Policy[] {};
    public AuthorizeAttribute ()
    {
    }
    public AuthorizeAttribute (string[] roles,params Policy[] policies)
    {
        _roles = roles ;
        _policies = policies;
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
    private bool ConstainsPolicies(IList<Policy> policies, IList<Policy> policiesToContains)
    {
        foreach(Policy policy in policiesToContains)
        {
            if (policies.Contains(policy))
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
        bool Roles_pass = true;
        bool Policies_pass = true;
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
            Roles_pass = false;
        }
        else if (_policies.Any() && !ConstainsPolicies(_policies,((User)user).Policies) ) 
        {
            // policy not authorized
            Policies_pass = false;
        }
        if ( Roles_pass == false && Policies_pass == false)
        {
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