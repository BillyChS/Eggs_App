namespace Eggs_App.API.Infrastructure.Data.Entities;

public class Sale
{
    public int Id { get; set; }
    public int CartonType { get; set; }
    public int Quantity { get; set; }
    public decimal PricePerCarton { get; set; }
    public decimal TotalAmount { get; set; }
    public DateTime SaleDate { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public PaymentStatus PaymentStatus { get; set; } = PaymentStatus.Paid;
    public string? CustomerName { get; set; }
    public DateTime? PaidDate { get; set; }

    public int UserId { get; set; }
    public User User { get; set; } = null!;
}