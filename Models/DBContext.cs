using System.Reflection;
using MediatR;
using Microsoft.Extensions.Options;
using Microsoft.EntityFrameworkCore;
using StartFromScratch.Entities;
using StartFromScratch.Common;
// using Microsoft.AspNetCore.ApiAuthorization.IdentityServer;
// using Duende.IdentityServer.EntityFramework.Options;
// using Microsoft.EntityFrameworkCore;
// using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
namespace StartFromScratch.Models;

public class DataContext : DbContext
{
    private readonly IMediator _mediator;
    private readonly AuditableEntitySaveChangesInterceptor _auditableEntitySaveChangesInterceptor;

    public DataContext(
        DbContextOptions<DataContext> options,
        IMediator mediator,
        AuditableEntitySaveChangesInterceptor auditableEntitySaveChangesInterceptor) 
        : base(options)
    {
        _mediator = mediator;
        _auditableEntitySaveChangesInterceptor = auditableEntitySaveChangesInterceptor;
    }

    public DbSet<User> Users => Set<User>();
    public DbSet<Role> Roles => Set<Role>();
    public DbSet<TodoItem> TodoItems => Set<TodoItem>();
    public DbSet<Product> Products => Set<Product>();
    public DbSet<Order> Orders => Set<Order>();
    public DbSet<Category> Categories => Set<Category>();




    protected override void OnModelCreating(ModelBuilder builder)
    {
        builder.ApplyConfigurationsFromAssembly(Assembly.GetExecutingAssembly());

        base.OnModelCreating(builder);

        builder.Entity<User>().Property(f => f.Id).ValueGeneratedOnAdd();
        builder.Entity<Role>().Property(f => f.Id).ValueGeneratedOnAdd();
        builder.Entity<TodoItem>().Property(f => f.Id).ValueGeneratedOnAdd();
        builder.Entity<Product>().Property(f => f.Id).ValueGeneratedOnAdd();
        builder.Entity<Order>().Property(f => f.Id).ValueGeneratedOnAdd();
        builder.Entity<Order>().HasIndex(u => u.Code).IsUnique();
        builder.Entity<Category>().Property(f => f.Id).ValueGeneratedOnAdd();
        builder.Entity<Category>().HasIndex(u => u.Code).IsUnique();


    }

    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
    {
        optionsBuilder.AddInterceptors(_auditableEntitySaveChangesInterceptor);
    }

    public override async Task<int> SaveChangesAsync(CancellationToken cancellationToken = default)
    {
        await _mediator.DispatchDomainEvents(this);

        return await base.SaveChangesAsync(cancellationToken);
    }
}
