using MediatR;

namespace Eggs_App.API.Features.Expenses.GetExpenses;

// DTO returned to the client for each expense
public record ExpenseDto(
    int Id,
    string Name,
    decimal Amount,
    string? Description,
    string? CategoryName,
    DateTime ExpenseDate
);

// Query to get all expenses for a given month and year
public record GetExpensesQuery(int Month, int Year) : IRequest<List<ExpenseDto>>;