using System.Text.Json.Serialization;
using StartFromScratch.Common;
namespace StartFromScratch.Entities;
public enum OrderStatus
{
    CREATED,
    PENDING,
    ACCEPTED,
    CANCELLED
}
public enum PaymentStatus 
{
    WAITING,
    PENDING,
    SUCCEEDED,
    CANCELLED,
    FAILED,
}
public enum AdminVerifyStatus
{
    ACCEPTED,
    DENIED,
    WAITING,
}
public class Order : BaseAuditableEntity
{
    public string? Code {get;set;}
    public int? BillId {get;set;}
    public string? ProductIds {get;set;}
    public string? Quantities {get;set;}
    public float TotalPrice {get;set;}
    public OrderStatus Status {get;set;} = OrderStatus.CREATED;
    public PaymentStatus PaymentStatus {get;set;} = PaymentStatus.WAITING;
    public AdminVerifyStatus VerifyStatus {get;set;} = AdminVerifyStatus.WAITING;
    public bool CanbeEdit {get;set;} = true;
    public string? PaymentLink {get;set;}
    public DateTime? PaymentLinkExpired {get;set;}

}