using System.Text.Json.Serialization;
using StartFromScratch.Common;
namespace StartFromScratch.Entities;
public enum Currency 
{
    VND
}
public class Product : BaseAuditableEntity
{
    public string? Base64Image {get;set;}
    public string? Code {get;set;}
    public string? Name {get;set;}
    public string? Description {get;set;}
    //public string? Supplier {get;set;}
    //public DateTime? ImportDate {get;set;}
    //public float Price {get; set;} 
    public Currency? Currency {get; set;} 
    public float SellPrice {get;set;}
    public float InStock {get;set;}
    public bool Display {get;set;}
    public int PurchasedCount {get;set;}
    public int NumberSoldCount {get;set;}

    //public string Category {get;set;}

}