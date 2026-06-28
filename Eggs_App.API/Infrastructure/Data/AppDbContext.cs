using Eggs_App.API.Infrastructure.Data.Entities;
using Microsoft.EntityFrameworkCore;

namespace Eggs_App.API.Infrastructure.Data;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

    public DbSet<User> Users => Set<User>();
    public DbSet<Sale> Sales => Set<Sale>();
    public DbSet<Expense> Expenses => Set<Expense>();
    public DbSet<Category> Categories => Set<Category>();
    public DbSet<Customer> Customers => Set<Customer>();
    public DbSet<Abono> Abonos => Set<Abono>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        modelBuilder.Entity<User>(entity =>
        {
            entity.HasKey(u => u.Id);
            entity.Property(u => u.Username).IsRequired().HasMaxLength(50);
            entity.Property(u => u.PasswordHash).IsRequired();
            entity.Property(u => u.Role).IsRequired().HasMaxLength(20);
            entity.HasIndex(u => u.Username).IsUnique();
        });

        modelBuilder.Entity<Sale>(entity =>
        {
            entity.HasKey(s => s.Id);
            entity.Property(s => s.PricePerCarton).HasColumnType("decimal(18,2)");
            entity.Property(s => s.TotalAmount).HasColumnType("decimal(18,2)");
            entity.Property(s => s.IsCredit).HasDefaultValue(false);
            entity.HasOne(s => s.User)
                  .WithMany(u => u.Sales)
                  .HasForeignKey(s => s.UserId)
                  .OnDelete(DeleteBehavior.Restrict);
            entity.HasOne(s => s.Customer)
                  .WithMany(c => c.Sales)
                  .HasForeignKey(s => s.CustomerId)
                  .OnDelete(DeleteBehavior.SetNull);
        });

        modelBuilder.Entity<Category>(entity =>
        {
            entity.HasKey(c => c.Id);
            entity.Property(c => c.Name).IsRequired().HasMaxLength(50);
        });

        modelBuilder.Entity<Category>().HasData(
            new Category { Id = 1, Name = "Alimento",              CreatedAt = new DateTime(2026, 1, 1) },
            new Category { Id = 2, Name = "Vitaminas",             CreatedAt = new DateTime(2026, 1, 1) },
            new Category { Id = 3, Name = "Desparasitantes",       CreatedAt = new DateTime(2026, 1, 1) },
            new Category { Id = 4, Name = "Burucha",               CreatedAt = new DateTime(2026, 1, 1) },
            new Category { Id = 5, Name = "Cartones",              CreatedAt = new DateTime(2026, 1, 1) },
            new Category { Id = 6, Name = "Plásticos/Envoltorios", CreatedAt = new DateTime(2026, 1, 1) },
            new Category { Id = 7, Name = "Equipo",                CreatedAt = new DateTime(2026, 1, 1) }
        );

        modelBuilder.Entity<Expense>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Amount).HasColumnType("decimal(18,2)");
            entity.Property(e => e.OtherText).HasMaxLength(200);
            entity.HasOne(e => e.User)
                  .WithMany(u => u.Expenses)
                  .HasForeignKey(e => e.UserId)
                  .OnDelete(DeleteBehavior.Restrict);
            entity.HasOne(e => e.Category)
                  .WithMany(c => c.Expenses)
                  .HasForeignKey(e => e.CategoryId)
                  .OnDelete(DeleteBehavior.SetNull);
        });

        modelBuilder.Entity<Customer>(entity =>
        {
            entity.HasKey(c => c.Id);
            entity.Property(c => c.Name).IsRequired().HasMaxLength(100);
            entity.Property(c => c.Phone).HasMaxLength(30);
            entity.Property(c => c.Note).HasMaxLength(300);
            entity.HasOne(c => c.User)
                  .WithMany(u => u.Customers)
                  .HasForeignKey(c => c.UserId)
                  .OnDelete(DeleteBehavior.Restrict);
        });

        modelBuilder.Entity<Abono>(entity =>
        {
            entity.HasKey(a => a.Id);
            entity.Property(a => a.Amount).HasColumnType("decimal(18,2)");
            entity.Property(a => a.Note).HasMaxLength(300);
            entity.HasOne(a => a.User)
                  .WithMany(u => u.Abonos)
                  .HasForeignKey(a => a.UserId)
                  .OnDelete(DeleteBehavior.Restrict);
            entity.HasOne(a => a.Customer)
                  .WithMany(c => c.Abonos)
                  .HasForeignKey(a => a.CustomerId)
                  .OnDelete(DeleteBehavior.Cascade);
        });
    }
}