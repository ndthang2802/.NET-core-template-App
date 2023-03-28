using StartFromScratch.Models;
using StartFromScratch.Entities;
using StartFromScratch.Authorization;
using Microsoft.EntityFrameworkCore;
using StartFromScratch.Mappings;

namespace StartFromScratch.Services;
public interface ICategoryService : IBaseService<Category>
{
    //public Task<PaginatedList<Category>> GetWithPagination (int PageNumber, int PageSize);
    public Task<List<Category>> GetAllWithNested();
}
public class CategoryService :  BaseService<Category>, ICategoryService
{
    private DataContext _context;
    public CategoryService(DataContext context) : base (context)
    {
        _context = context;
    }
    private List<Category> DisplayTree(List<Category> elements) {
        var res = new List<Category>();
        foreach (var element in elements) {
                var children = DisplayTree(elements.Where(e => e.ParentId == element.Id).ToList()).ToArray();
                if (children.Length != 0) {
                    res.Add(new Category {
                        Id = element.Id,
                        Code = element.Code,
                        DisplayName = element.DisplayName,
                        Description = element.Description,
                        ParentId = element.ParentId,
                        IconURL = element.IconURL,
                        Level = element.Level,
                        Created = element.Created,
                        CreatedBy = element.CreatedBy,
                        SubCategoriesList = children
                    });
                } 
                else {
                    res.Add(new Category {
                        Id = element.Id,
                        Code = element.Code,
                        DisplayName = element.DisplayName,
                        Description = element.Description,
                        ParentId = element.ParentId,
                        IconURL = element.IconURL,
                        Level = element.Level,
                        Created = element.Created,
                        CreatedBy = element.CreatedBy,
                    });
                }
            
        }
            return res;
    }

    public async Task<List<Category>> GetAllWithNested()
    {
        List<Category> response =  await _context.Categories.ToListAsync( new CancellationToken());
        return  DisplayTree(response).Where(x => x.ParentId == 0).ToList();
        
    }
}