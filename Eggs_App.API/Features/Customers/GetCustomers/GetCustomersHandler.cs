using Eggs_App.API.Infrastructure.Data;
using Eggs_App.API.Infrastructure.Data.Entities;
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

        // Balance = sum of pending credit sales - sum of abonos on those sales.
        var customers = await _context.Customers
            .Where(c => c.UserId == userId)
            .Select(c => new
            {
                c.Id, c.Name, c.Phone,
                TotalPending = c.Sales
                    .Where(s => s.IsCredit && s.PaymentStatus == PaymentStatus.Pending)
                    .Sum(s => (decimal?)s.TotalAmount) ?? 0m,
                TotalAbonos = c.Sales
                    .Where(s => s.IsCredit && s.PaymentStatus == PaymentStatus.Pending)
                    .SelectMany(s => s.Abonos)
                    .Sum(a => (decimal?)a.Amount) ?? 0m,
            })
            .ToListAsync(cancellationToken);

        var result = customers
            .Select(c => new CustomerDto(c.Id, c.Name, c.Phone, c.TotalPending - c.TotalAbonos))
            .ToList();

        if (request.WithBalance == true)
            return result.Where(c => c.Balance > 0).OrderByDescending(c => c.Balance).ToList();

        return result;
    }
}
