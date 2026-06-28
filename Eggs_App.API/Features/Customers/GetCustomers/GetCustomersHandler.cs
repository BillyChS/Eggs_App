using Eggs_App.API.Infrastructure.Data;
using MediatR;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

namespace Eggs_App.API.Features.Customers.GetCustomers;

public class GetCustomersHandler : IRequestHandler<GetCustomersQuery, List<CustomerDto>>
{
    private readonly AppDbContext _context;
    private readonly IHttpContextAccessor _httpContextAccessor;

    public GetCustomersHandler(AppDbContext context, IHttpContextAccessor httpContextAccessor)
    {
        _context = context;
        _httpContextAccessor = httpContextAccessor;
    }

    public async Task<List<CustomerDto>> Handle(GetCustomersQuery request, CancellationToken cancellationToken)
    {
        var userId = int.Parse(
            _httpContextAccessor.HttpContext!.User
                .FindFirstValue(ClaimTypes.NameIdentifier)!);

        // Balance is computed in-database via correlated subqueries to avoid loading collections.
        var customers = await _context.Customers
            .Where(c => c.UserId == userId)
            .Select(c => new CustomerDto(
                c.Id,
                c.Name,
                c.Phone,
                (c.Sales.Where(s => s.IsCredit).Sum(s => (decimal?)s.TotalAmount) ?? 0m)
                - (c.Abonos.Sum(a => (decimal?)a.Amount) ?? 0m)))
            .ToListAsync(cancellationToken);

        if (request.WithBalance == true)
            return customers.Where(c => c.Balance > 0).OrderByDescending(c => c.Balance).ToList();

        return customers;
    }
}
