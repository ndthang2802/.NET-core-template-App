
using MediatR;
using AutoMapper;
using System.Net;
using FluentValidation;
using StartFromScratch.Models;
using StartFromScratch.Entities;
using StartFromScratch.Services;
using StartFromScratch.Mappings;
using System.Drawing;
using System.Drawing.Imaging; 
namespace StartFromScratch.Usecases.Products.Commands;
public record ProductInformationUpload   {
    public List<ProductImage> Image {get;set;} = new ();
    public int InStock {get; set;}
    public string Color {get;  set;} = "";
    public string Sizes {get; set;} = "";
}
public record AddProductCommand : IRequest<Result>, IMapTo<Product>
{
    public List<ProductInformationUpload> Information {get;set;} = new ();
    public string? Name {get;set;}
    public string? Description {get;set;}
    //public Currency? Currency {get; set;} 
    public float SellPrice {get;set;}
    public bool Display {get;set;}
    public string? Category {get;set;}
    public void Mapping(Profile profile)
    {
        profile.CreateMap<AddProductCommand, Product>();
    }
}
public class AddProductCommandValidator : AbstractValidator<AddProductCommand>
{
    private readonly DataContext _context;
    public AddProductCommandValidator(DataContext context)
    {
        _context = context;
        RuleFor(v => v.Information).NotEmpty().NotNull().WithMessage("Details of product can not be empty.")
        .ForEach(inf => {
            inf.ChildRules(c => {
                c.RuleFor( c_ => c_.InStock).NotEmpty().NotNull().GreaterThanOrEqualTo(0).WithMessage("In stock mus greater or equal to 0");
                c.RuleFor( c_ => c_.Color).NotEmpty().NotNull().WithMessage("Color can not be empty");
                c.RuleFor( c_ => c_.Sizes).NotEmpty().NotNull().WithMessage("Size can not be empty");
                c.RuleFor( c_ => c_.Image).NotEmpty().NotNull().WithMessage("Image can not be empty")
                .ForEach(img => {
                    img.ChildRules(i => {
                        i.RuleFor(i_ => i_.data).NotNull().NotEmpty().WithMessage("Image can not be null");
                    });
                });
            });
        });
        RuleFor(v => v.Name).NotEmpty().NotNull().WithMessage("Name of products can not be empty.");
        RuleFor(v => v.Description).NotEmpty().NotNull().WithMessage("Description of products can not be empty.");
        RuleFor(v => v.SellPrice).NotEmpty().NotNull().WithMessage("Sell Price of products can not be empty.");
        //RuleFor(v => v.Currency).NotEmpty().NotNull().WithMessage("Currency of products can not be empty.");
        RuleFor(v => v.Display).NotEmpty().NotNull().WithMessage("Display option of products can not be empty.");
    }
}
public class AddProductCommandHandler : IRequestHandler<AddProductCommand, Result>
{
    private readonly IMapper _mapper ;
    private readonly IProductService _ProductService;
    private readonly ICurrentUserService _currentUserService;
    private IWebHostEnvironment  _environment;
    private string productImageSavePath = "";

    public AddProductCommandHandler(IProductService ProductService,ICurrentUserService currentUserService, IWebHostEnvironment  Environment,IMapper mapper)
    {
        _mapper = mapper;
        _ProductService = ProductService;
        _currentUserService = currentUserService;
        _environment = Environment;
        productImageSavePath = _environment.WebRootPath + "/images/products/";
    }
    public async Task<Result> Handle(AddProductCommand request, CancellationToken cancellationToken)
    {
        Product entity =  _mapper.Map<AddProductCommand,Product>(request);
        entity.Code =   String.Concat(Guid.NewGuid().ToString("N").Select(c => (char)(c + 17))).ToUpper().Substring(0, 4) + 
                        String.Concat(Guid.NewGuid().ToString("N").Select(c => (char)(c + 17))).ToUpper().Substring(10, 4);
        if (request.Information != null)
        {
            foreach(ProductInformationUpload inf in request.Information)
            {
                if (inf.Image.Count() <= 0)
                {
                    return Result.Failure(HttpStatusCode.BadRequest, new string [] {"Product Fails"});
                }
                ProductImage img = inf.Image[0];
                byte[] imageBytes = Convert.FromBase64String(img.data.Split(",")[1]);
                using (MemoryStream ms = new MemoryStream(imageBytes))
                {
                    ms.Position = 0;
                    using (Bitmap bm = new Bitmap(ms))
                    {
                        string imgName = Guid.NewGuid().ToString() + ".jpg";
                        ProductInformation info = new ProductInformation {
                            ImageName = imgName,
                            InStock = inf.InStock,
                            Color = inf.Color,
                            Sizes = inf.Sizes
                        };
                        entity.Details.Add(info);
                        bm.Save(productImageSavePath + imgName, ImageFormat.Jpeg);
                    }
                }
            }
        }
        bool succeeded = await  _ProductService.AddAsync(entity);
        if (succeeded)
        {
            BaseReponse reponse = new BaseReponse {
                Message = "Add Product Success!",
                Data = entity
            };
            return Result.Success(reponse);
        }
        else {
            return Result.Failure(HttpStatusCode.BadRequest, new string [] {"Product Fails"});
        }
    }
}