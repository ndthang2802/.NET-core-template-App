using System.Text.Json.Serialization;
using StartFromScratch.Common;
namespace StartFromScratch.Entities;
public class TodoItem : BaseAuditableEntity
{
    public string? Title {get;set;}
    public string? Note {get;set;}
    public bool Done {get;set;}
    public DateTime? Reminder {get;set;}
    public int Priority {get; set;} 
}