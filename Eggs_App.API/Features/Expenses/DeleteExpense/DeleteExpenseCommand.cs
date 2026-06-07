using MediatR;

namespace Eggs_App.API.Features.Expenses.DeleteExpense;

public record DeleteExpenseCommand(int Id) : IRequest<bool>;
