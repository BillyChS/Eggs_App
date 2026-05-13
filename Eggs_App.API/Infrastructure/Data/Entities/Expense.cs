namespace Eggs_App.API.Infrastructure.Data.Entities;

public class Expense
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public decimal Amount { get; set; }
    public string? Description { get; set; }    // Opcional
    public DateTime ExpenseDate { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public int UserId { get; set; }
    public User User { get; set; } = null!;

    public int? CategoryId { get; set; }        // Opcional (skip)
    public Category? Category { get; set; }
}