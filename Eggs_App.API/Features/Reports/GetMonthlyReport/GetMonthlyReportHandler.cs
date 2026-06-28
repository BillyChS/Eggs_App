using Eggs_App.API.Infrastructure.Data;
using Eggs_App.API.Infrastructure.Data.Entities;
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
        var userId = int.Parse(
            _httpContextAccessor.HttpContext!.User
                .FindFirstValue(ClaimTypes.NameIdentifier)!);

        // Cash-basis: include all sales in the list but total only paid ones.
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
                s.SaleDate,
                s.PaymentStatus,
                s.CustomerName))
            .ToListAsync(cancellationToken);

        var expenses = await _context.Expenses
            .Include(e => e.Category)
            .Where(e => e.UserId == userId
                     && e.ExpenseDate.Month == request.Month
                     && e.ExpenseDate.Year == request.Year)
            .OrderByDescending(e => e.ExpenseDate)
            .Select(e => new ExpenseSummaryDto(
                e.Amount,
                e.Category != null ? e.Category.Name : e.OtherText,
                e.ExpenseDate))
            .ToListAsync(cancellationToken);

        var totalSales = sales
            .Where(s => s.PaymentStatus == PaymentStatus.Paid)
            .Sum(s => s.TotalAmount);
        var totalExpenses = expenses.Sum(e => e.Amount);
        var netProfit = totalSales - totalExpenses;
        var totalCartonsSold = sales
            .Where(s => s.PaymentStatus == PaymentStatus.Paid)
            .Sum(s => s.Quantity);
        var pendingReceivables = sales
            .Where(s => s.PaymentStatus == PaymentStatus.Pending)
            .Sum(s => s.TotalAmount);

        return new MonthlyReportDto(
            request.Month,
            request.Year,
            totalSales,
            totalExpenses,
            netProfit,
            totalCartonsSold,
            pendingReceivables,
            sales,
            expenses
        );
    }
}