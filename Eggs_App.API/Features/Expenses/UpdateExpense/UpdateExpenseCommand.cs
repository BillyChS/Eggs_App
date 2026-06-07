using MediatR;

namespace Eggs_App.API.Features.Expenses.UpdateExpense;

public record UpdateExpenseBody(
    decimal Amount,
    DateTime ExpenseDate,
    int? CategoryId,
    string? OtherText
);

public record UpdateExpenseCommand(
    int Id,
    decimal Amount,
    DateTime ExpenseDate,
    int? CategoryId,
    string? OtherText
) : IRequest<bool>;
