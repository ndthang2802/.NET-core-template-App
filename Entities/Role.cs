namespace StartFromScratch.Entities;

using System.ComponentModel.DataAnnotations.Schema;
using StartFromScratch.Common;
public enum Roles
{
    Admin,
    User
}

public class Role : BaseAuditableEntity
{
    public string? Code {get;set;}
    public string? Description {get;set;}
    public int Level {get;set;} = 0;
    public string? Policies {get;set;}
    [NotMapped]
    public IList<Policy>? PoliciesList {get;set;} 
}