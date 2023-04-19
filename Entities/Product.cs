using System.Text.Json.Serialization;
using StartFromScratch.Common;
using System.ComponentModel.DataAnnotations.Schema;
namespace StartFromScratch.Entities;
public enum Currency 
{
    VND
}
public record ProductImage {
    public int id {get;set;}
    public string data {get;set;} = "";
    public string name {get;set;} = "";
    public dynamic? size {get;set;}
    public string type {get;set;} = "";


}

public class Product : BaseAuditableEntity
{
    public string? Code {get;set;}
    public string? Name {get;set;}
    public string? Description {get;set;}
    //public string? Supplier {get;set;}
    public DateTime? ImportDate {get;set;}
    public float? ImportPrice {get; set;} = 0 ; 
    public Currency? Currency {get; set;} 
    public float SellPrice {get;set;} = 0 ;
    public float InStock {get;set;} = 0;
    public bool Display {get;set;} = true;
    public int? PurchasedCount {get;set;} = 0 ;
    public int? NumberSoldCount {get;set;} = 0;
    public float Discount {get;set;} = 0;
    public string? Category {get;set;}
    public string? ImagesName {get;set;} 
    public List<ProductInformation> Details {get;set;} = new ();
}


public class ProductInformation {
    public string ImageName {get; set;} = null!;
    public int InStock {get; set;}
    public string Color {get;  set;} = null!;
    public string Sizes {get; set;} = null!;
    
}


