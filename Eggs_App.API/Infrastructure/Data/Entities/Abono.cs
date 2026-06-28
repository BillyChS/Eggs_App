namespace Eggs_App.API.Infrastructure.Data.Entities;

public class Abono
{
    public int Id { get; set; }
    public int UserId { get; set; }
    public User User { get; set; } = null!;

    public int CustomerId { get; set; }
    public Customer Customer { get; set; } = null!;

    public decimal Amount { get; set; }
    public DateTime AbonoDate { get; set; } = DateTime.Now;
    public string? Note { get; set; }
}
