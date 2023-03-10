using StartFromScratch.Authorization;
using StartFromScratch.Common;
using StartFromScratch.Models;
using StartFromScratch.Services;
using Microsoft.EntityFrameworkCore;
using MediatR;
using System.Reflection;
using System.Text.Json.Serialization;
using FluentValidation;
using AutoMapper.Internal;
using StartFromScratch.Mappings;
using StartFromScratch.Entities;
using Microsoft.OpenApi.Models;

var builder = WebApplication.CreateBuilder(args);



// Add services to the container.
builder.Services.AddHttpContextAccessor();
builder.Services.AddSingleton<ICurrentUserService, CurrentUserService>();
builder.Services.AddTransient(typeof(IPipelineBehavior<,>), typeof(ValidationBehaviour<,>));
builder.Services.AddScoped<AuditableEntitySaveChangesInterceptor>();
builder.Services.AddDbContext<DataContext>(options =>
                    options.UseSqlite(builder.Configuration.GetConnectionString("AppData")
                ));
builder.Services.AddCors();
builder.Services.AddControllers(options =>options.Filters.Add<ApiExceptionFilterAttribute>()).AddJsonOptions(x =>
    {
        // serialize enums as strings in api responses (e.g. Role)
        x.JsonSerializerOptions.Converters.Add(new JsonStringEnumConverter());
    });
builder.Services.AddScoped<IJwtUtil, JwtUtil>();
builder.Services.AddScoped(typeof(IBaseService<>), typeof(BaseService<>));
builder.Services.AddScoped<IUserService, UserService>();
builder.Services.AddScoped<IRoleService, RoleService>();
builder.Services.AddScoped<ITodoItemService, TodoItemService>();


// var mapperConfig = new MapperConfiguration(mc =>
//      {
//          mc.Internal().MethodMappingEnabled = false;
//          mc.AddProfile(new MappingProfile());
//      });
// IMapper mapper = mapperConfig.CreateMapper();
// builder.Services.AddSingleton(mapper);
//builder.Services.AddAutoMapper(Assembly.GetExecutingAssembly());
builder.Services.AddAutoMapper(cfg => cfg.Internal().MethodMappingEnabled = false, typeof(MappingProfile).Assembly);
builder.Services.AddMediatR(Assembly.GetExecutingAssembly());

builder.Services.AddValidatorsFromAssembly(Assembly.GetExecutingAssembly());


builder.Services.AddControllers();

                //.AddFluentValidation(x => x.AutomaticValidationEnabled = false);
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.AddSwaggerGen(option =>
{
    option.SwaggerDoc("v1", new OpenApiInfo { Title = "Demo API", Version = "v1" });
    option.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
    {
        In = ParameterLocation.Header,
        Description = "Please enter a valid token",
        Name = "Authorization",
        Type = SecuritySchemeType.Http,
        BearerFormat = "JWT",
        Scheme = "Bearer"
    });
    option.AddSecurityRequirement(new OpenApiSecurityRequirement
    {
        {
            new OpenApiSecurityScheme
            {
                Reference = new OpenApiReference
                {
                    Type=ReferenceType.SecurityScheme,
                    Id="Bearer"
                }
            },
            new string[]{}
        }
    });
});


var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI(c => { c.SwaggerEndpoint("./v1/swagger.json", " API V1") ; });
}

app.UseCors(x => x
        .AllowAnyOrigin()
        .AllowAnyMethod()
        .AllowAnyHeader());

    
// custom jwt auth middleware
app.UseMiddleware<JwtMiddleWare>();

app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();






app.Run();
