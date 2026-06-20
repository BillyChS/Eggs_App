using Eggs_App.API.Infrastructure.Data.Entities;
using MediatR;

namespace Eggs_App.API.Features.Reports.GetMonthlyReport;

public record MonthlyReportDto(
    int Month,
    int Year,
    decimal TotalSales,
    decimal TotalExpenses,
    decimal NetProfit,
    int TotalCartonsSold,
    decimal PendingReceivables,
    List<SaleSummaryDto> Sales,
    List<ExpenseSummaryDto> Expenses
);

public record SaleSummaryDto(
    int CartonType,
    int Quantity,
    decimal PricePerCarton,
    decimal TotalAmount,
    DateTime SaleDate,
    PaymentStatus PaymentStatus,
    string? CustomerName
);

public record ExpenseSummaryDto(
    decimal Amount,
    string? CategoryName,
    DateTime ExpenseDate
);

public record GetMonthlyReportQuery(int Month, int Year) : IRequest<MonthlyReportDto>;