using MediatR;
using AutoMapper;
using StartFromScratch.Models;
using StartFromScratch.Entities;
namespace StartFromScratch.Usecases.Policies.Queries;
public record GetAllPoliciesCommand : IRequest<Result>;
public class GetAllPoliciesCommandHandler : IRequestHandler<GetAllPoliciesCommand, Result>
{
    public GetAllPoliciesCommandHandler(){}
    public async Task<Result> Handle(GetAllPoliciesCommand request, CancellationToken cancellationToken)
    {  
        
        BaseReponse reponse = new BaseReponse {
            Message = "Query Success!",
            Data = Enum.GetNames(typeof(Policy)).ToList()
        };
        return await Task.FromResult(Result.Success(reponse));
    }
}