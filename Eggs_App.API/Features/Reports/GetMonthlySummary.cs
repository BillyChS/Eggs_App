using Eggs_App.API.Infrastructure.Data;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Eggs_App.API.Features.Reports;

public static class GetMonthlySummary
{
    public record Query(int Month, int Year, int UserId) : IRequest<Response>;

    public record CategoryTotal(string Category, decimal Total);

    public record Response(
        int Month,
        int Year,
        decimal TotalSalesRevenue,
        IReadOnlyList<CategoryTotal> ExpensesByCategory,
        decimal TotalExpenses,
        decimal NetProfit);

    public class Handler : IRequestHandler<Query, Response>
    {
        private readonly AppDbContext _db;

        public Handler(AppDbContext db) => _db = db;

        public async Task<Response> Handle(Query request, CancellationToken ct)
        {
            // Sales already store TotalAmount per transaction, so we sum it directly.
            // Nullable cast + ?? 0 returns zero for an empty period (no error).
            var salesRevenue = await _db.Sales
                .Where(s => s.UserId == request.UserId
                            && s.SaleDate.Month == request.Month
                            && s.SaleDate.Year == request.Year)
                .SumAsync(s => (decimal?)s.TotalAmount, ct) ?? 0m;

            // Group expenses by category name; uncategorized go to "Sin categoría".
            var expensesByCategory = await _db.Expenses
                .Where(e => e.UserId == request.UserId
                            && e.ExpenseDate.Month == request.Month
                            && e.ExpenseDate.Year == request.Year)
                .GroupBy(e => e.Category != null ? e.Category.Name : "Sin categoría")
                .Select(g => new CategoryTotal(g.Key, g.Sum(e => e.Amount)))
                .ToListAsync(ct);

            var totalExpenses = expensesByCategory.Sum(c => c.Total);
            var netProfit = salesRevenue - totalExpenses;

            return new Response(
                request.Month,
                request.Year,
                decimal.Round(salesRevenue, 2),
                expensesByCategory,
                decimal.Round(totalExpenses, 2),
                decimal.Round(netProfit, 2));
        }
    }
}