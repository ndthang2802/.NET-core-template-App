using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;
using StartFromScratch.Common;
namespace StartFromScratch.Entities;

public class Category : BaseAuditableEntity
{
    public string? Code {get;set;}
    public string? DisplayName {get;set;}
    public string? Description {get;set;}
    public int? ParentId {get;set;} = 0;
    public string? IconURL {get;set;}
    public int? Level {get;set;}
    [NotMapped]
    public IList<Category>? SubCategoriesList {get;set;} 

}