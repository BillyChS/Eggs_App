using Eggs_App.API.Infrastructure.Data;
using MediatR;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

namespace Eggs_App.API.Features.Expenses.GetExpenses;

public class GetExpensesHandler : IRequestHandler<GetExpensesQuery, List<ExpenseDto>>
{
    private readonly AppDbContext _context;
    private readonly IHttpContextAccessor _httpContextAccessor;

    public GetExpensesHandler(AppDbContext context, IHttpContextAccessor httpContextAccessor)
    {
        _context = context;
        _httpContextAccessor = httpContextAccessor;
    }

    public async Task<List<ExpenseDto>> Handle(GetExpensesQuery request, CancellationToken cancellationToken)
    {
        // Extract user ID from JWT claims
        var userId = int.Parse(
            _httpContextAccessor.HttpContext!.User
                .FindFirstValue(ClaimTypes.NameIdentifier)!);

        // Fetch expenses filtered by user, month and year
        // Include category name if assigned
        return await _context.Expenses
            .Include(e => e.Category)
            .Where(e => e.UserId == userId
                     && e.ExpenseDate.Month == request.Month
                     && e.ExpenseDate.Year == request.Year)
            .OrderByDescending(e => e.ExpenseDate)
            .Select(e => new ExpenseDto(
                e.Id,
                e.Name,
                e.Amount,
                e.Description,
                e.Category != null ? e.Category.Name : null,
                e.ExpenseDate))
            .ToListAsync(cancellationToken);
    }
}