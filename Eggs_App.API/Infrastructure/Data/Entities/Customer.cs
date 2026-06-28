namespace Eggs_App.API.Infrastructure.Data.Entities;

public class Customer
{
    public int Id { get; set; }
    public int UserId { get; set; }
    public User User { get; set; } = null!;

    public string Name { get; set; } = string.Empty;
    public string? Phone { get; set; }
    public string? Note { get; set; }
    public DateTime CreatedDate { get; set; } = DateTime.Now;

    public ICollection<Sale> Sales { get; set; } = [];
}
