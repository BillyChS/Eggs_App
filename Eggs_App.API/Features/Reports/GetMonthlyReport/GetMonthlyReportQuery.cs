using MediatR;

namespace Eggs_App.API.Features.Reports.GetMonthlyReport;

// DTO with the monthly financial summary
public record MonthlyReportDto(
    int Month,
    int Year,
    decimal TotalSales,
    decimal TotalExpenses,
    decimal NetProfit,
    int TotalCartonsSold,
    List<SaleSummaryDto> Sales,
    List<ExpenseSummaryDto> Expenses
);

// Summary of each sale for the report
public record SaleSummaryDto(
    int CartonType,
    int Quantity,
    decimal PricePerCarton,
    decimal TotalAmount,
    DateTime SaleDate
);

// Summary of each expense for the report
public record ExpenseSummaryDto(
    decimal Amount,
    string? CategoryName,   // Category.Name, OtherText, or null
    DateTime ExpenseDate
);

// Query to get the full monthly financial report
public record GetMonthlyReportQuery(int Month, int Year) : IRequest<MonthlyReportDto>;