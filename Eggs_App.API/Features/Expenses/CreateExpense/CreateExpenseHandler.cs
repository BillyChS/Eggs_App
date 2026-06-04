using Eggs_App.API.Infrastructure.Data;
using Eggs_App.API.Infrastructure.Data.Entities;
using MediatR;
using Microsoft.AspNetCore.Http;
using System.Security.Claims;

namespace Eggs_App.API.Features.Expenses.CreateExpense;

public class CreateExpenseHandler : IRequestHandler<CreateExpenseCommand, int>
{
    private readonly AppDbContext _context;
    private readonly IHttpContextAccessor _httpContextAccessor;

    public CreateExpenseHandler(AppDbContext context, IHttpContextAccessor httpContextAccessor)
    {
        _context = context;
        _httpContextAccessor = httpContextAccessor;
    }

    public async Task<int> Handle(CreateExpenseCommand request, CancellationToken cancellationToken)
    {
        // Extract the user ID from the JWT claims
        var userId = int.Parse(
            _httpContextAccessor.HttpContext!.User
                .FindFirstValue(ClaimTypes.NameIdentifier)!);

        // Build the expense entity — ExpenseDate is set automatically
        var expense = new Expense
        {
            Name = request.Name,
            Amount = request.Amount,
            Description = request.Description,
            CategoryId = request.CategoryId,
            // Use local time instead of UTC to avoid timezone issues
            ExpenseDate = DateTime.Now,
            UserId = userId
        };

        _context.Expenses.Add(expense);
        await _context.SaveChangesAsync(cancellationToken);

        return expense.Id;
    }
}