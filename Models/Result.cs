using System.Net;
namespace StartFromScratch.Models;
public class Result
{
    internal Result( HttpStatusCode statusCode, bool succeeded, IEnumerable<string> errors, dynamic res)
    {
        Succeeded = succeeded;
        Errors = errors.ToArray();
        Responses = res;
        StatusCode = statusCode;
    }
    
    public HttpStatusCode StatusCode {get;set;}
    public bool Succeeded { get; set; }

    public string[] Errors { get; set; }
    public dynamic Responses {get;set;}

    public static Result Success(dynamic res)
    {
        return new Result(HttpStatusCode.OK ,true, Array.Empty<string>(), res);
    }

    public static Result Failure(HttpStatusCode statusCode,IEnumerable<string> errors)
    {
        
        return new Result(statusCode,false, errors, string.Empty);
    }

    public static Result ItemNotFound()
    {
        return new Result(HttpStatusCode.BadRequest, false,new string[] { "Request not found"}, string.Empty);
    }
    public static Result UnKnownRequest()
    {
        return new Result(HttpStatusCode.BadRequest, false,new string[] { "UnKnown Request"}, string.Empty);
    }
}

public class BaseReponse
{
    public string? Message {get;set;}
    public dynamic? Data {get;set;}
}