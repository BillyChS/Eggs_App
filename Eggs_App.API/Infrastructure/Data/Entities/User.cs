namespace Eggs_App.API.Infrastructure.Data.Entities
{
    public class User
    {
        public int Id { get; set; }
        public string Username { get; set; } = string.Empty;
        public string PasswordHash {get; set;} = string.Empty;
        public string Role { get; set; } = "Admin";
        public DateTime CreateAt { get; set; } = DateTime.UtcNow;
        public ICollection<Sale> Sales { get; set; } = [];
        public ICollection<Expense> Expenses { get; set; } = [];
    }
}
