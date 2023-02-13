namespace StartFromScratch.Entities;
public enum Policy 
{
    ANONYMOUS, // MUST ON TOP
    // policy
    GETALLPOLICY,
    // user
    GETALLUSER,
    // role
    ADDROLE,
    GETALLROLE,
    // product
    ADDPRODUCT,
    DELETEPRODUCT,
    UPDATEPRODUCT,
    // order
    VERIFYORDER,
    GETALLORDERBYTIME,
    // biggest policy
    ADMINISTRATOR
}