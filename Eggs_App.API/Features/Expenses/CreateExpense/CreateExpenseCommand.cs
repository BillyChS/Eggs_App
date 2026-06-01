using MediatR;

namespace Eggs_App.API.Features.Expenses.CreateExpense;

// Command to create a new expense — category is optional
public record CreateExpenseCommand(
    string Name,
    decimal Amount,
    string? Description,
    int? CategoryId
) : IRequest<int>;