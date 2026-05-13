namespace Eggs_App.API.Infrastructure.Data.Entities;

public class Sale
{
    public int Id { get; set; }
    public int CartonType { get; set; }        // 15 o 30 unidades
    public int Quantity { get; set; }           // Cantidad de cartones
    public decimal PricePerCarton { get; set; } // Precio en el momento de la venta
    public decimal TotalAmount { get; set; }    // Quantity * PricePerCarton
    public DateTime SaleDate { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public int UserId { get; set; }
    public User User { get; set; } = null!;
}