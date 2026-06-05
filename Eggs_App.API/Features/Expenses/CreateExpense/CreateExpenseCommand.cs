using MediatR;

namespace Eggs_App.API.Features.Expenses.CreateExpense;

public record CreateExpenseCommand(
    decimal Amount,
    DateTime ExpenseDate,
    int? CategoryId,
    string? OtherText
) : IRequest<int>;
