using Eggs_App.API.Infrastructure.Data;
using MediatR;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

namespace Eggs_App.API.Features.Reports.GetMonthlyReport;

public class GetMonthlyReportHandler : IRequestHandler<GetMonthlyReportQuery, MonthlyReportDto>
{
    private readonly AppDbContext _context;
    private readonly IHttpContextAccessor _httpContextAccessor;

    public GetMonthlyReportHandler(AppDbContext context, IHttpContextAccessor httpContextAccessor)
    {
        _context = context;
        _httpContextAccessor = httpContextAccessor;
    }

    public async Task<MonthlyReportDto> Handle(GetMonthlyReportQuery request, CancellationToken cancellationToken)
    {
        // Extract user ID from JWT claims
        var userId = int.Parse(
            _httpContextAccessor.HttpContext!.User
                .FindFirstValue(ClaimTypes.NameIdentifier)!);

        // Fetch all sales for the given month and year
        var sales = await _context.Sales
            .Where(s => s.UserId == userId
                     && s.SaleDate.Month == request.Month
                     && s.SaleDate.Year == request.Year)
            .OrderByDescending(s => s.SaleDate)
            .Select(s => new SaleSummaryDto(
                s.CartonType,
                s.Quantity,
                s.PricePerCarton,
                s.TotalAmount,
                s.SaleDate))
            .ToListAsync(cancellationToken);

        // Fetch all expenses for the given month and year
        var expenses = await _context.Expenses
            .Include(e => e.Category)
            .Where(e => e.UserId == userId
                     && e.ExpenseDate.Month == request.Month
                     && e.ExpenseDate.Year == request.Year)
            .OrderByDescending(e => e.ExpenseDate)
            .Select(e => new ExpenseSummaryDto(
                e.Name,
                e.Amount,
                e.Description,
                e.Category != null ? e.Category.Name : null,
                e.ExpenseDate))
            .ToListAsync(cancellationToken);

        // Calculate financial totals
        var totalSales = sales.Sum(s => s.TotalAmount);
        var totalExpenses = expenses.Sum(e => e.Amount);
        var netProfit = totalSales - totalExpenses;
        var totalCartonsSold = sales.Sum(s => s.Quantity);

        return new MonthlyReportDto(
            request.Month,
            request.Year,
            totalSales,
            totalExpenses,
            netProfit,
            totalCartonsSold,
            sales,
            expenses
        );
    }
}