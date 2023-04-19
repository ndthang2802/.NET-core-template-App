using System.Text.Json.Serialization;
using StartFromScratch.Common;
using System.ComponentModel.DataAnnotations.Schema;

namespace StartFromScratch.Entities;

public static class UserFunc {
    public static string HashPassword(string? Password)
    {
        return BCrypt.Net.BCrypt.HashPassword(Password);
    }
}

public class User : BaseAuditableEntity
{
    public string? Username {get;set;}
    public string? PhoneNumber {get;set;}
    public string? Address {get;set;}
    public string? Email {get;set;}
    [JsonIgnore]
    public string? PasswordHash { get; set; }
    public string Roles {get; set;} = string.Empty;
    [NotMapped]
    public IList<Policy> Policies {get;set;} = new List<Policy>();
    [NotMapped]
    public IList<Role> ListRoles {get;set;} = new List<Role>();
}