using Eggs_App.API.Infrastructure.Data;
using MediatR;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

namespace Eggs_App.API.Features.Expenses.UpdateExpense;

public class UpdateExpenseHandler : IRequestHandler<UpdateExpenseCommand, bool>
{
    private readonly AppDbContext _context;
    private readonly IHttpContextAccessor _httpContextAccessor;

    public UpdateExpenseHandler(AppDbContext context, IHttpContextAccessor httpContextAccessor)
    {
        _context = context;
        _httpContextAccessor = httpContextAccessor;
    }

    public async Task<bool> Handle(UpdateExpenseCommand request, CancellationToken cancellationToken)
    {
        var userId = int.Parse(
            _httpContextAccessor.HttpContext!.User
                .FindFirstValue(ClaimTypes.NameIdentifier)!);

        var expense = await _context.Expenses
            .FirstOrDefaultAsync(e => e.Id == request.Id && e.UserId == userId, cancellationToken);

        if (expense is null) return false;

        expense.Amount      = request.Amount;
        expense.ExpenseDate = request.ExpenseDate;
        expense.CategoryId  = request.CategoryId;
        expense.OtherText   = request.OtherText;

        await _context.SaveChangesAsync(cancellationToken);
        return true;
    }
}
