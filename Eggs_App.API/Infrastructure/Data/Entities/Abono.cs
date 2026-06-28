namespace Eggs_App.API.Infrastructure.Data.Entities;

public class Abono
{
    public int Id { get; set; }

    public int SaleId { get; set; }
    public Sale Sale { get; set; } = null!;

    public decimal Amount { get; set; }
    public DateTime AbonoDate { get; set; } = DateTime.Now;
    public string? Note { get; set; }
}
