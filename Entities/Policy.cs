namespace StartFromScratch.Entities;
public enum Policy 
{
    ANONYMOUS, // MUST ON TOP
    //Category
    UPDATECATEGORY,
    GETALLCATEGORIES,
    ADDCATEGORY,
    // policy
    GETALLPOLICY,
    // user
    GETALLUSER,
    // role
    ADDROLE,
    UPDATEROLE,
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