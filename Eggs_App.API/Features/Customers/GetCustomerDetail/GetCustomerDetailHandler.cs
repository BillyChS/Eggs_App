using Eggs_App.API.Infrastructure.Data;
using MediatR;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

namespace Eggs_App.API.Features.Customers.GetCustomerDetail;

public class GetCustomerDetailHandler : IRequestHandler<GetCustomerDetailQuery, CustomerDetailDto?>
{
    private readonly AppDbContext _context;
    private readonly IHttpContextAccessor _httpContextAccessor;

    public GetCustomerDetailHandler(AppDbContext context, IHttpContextAccessor httpContextAccessor)
    {
        _context = context;
        _httpContextAccessor = httpContextAccessor;
    }

    public async Task<CustomerDetailDto?> Handle(GetCustomerDetailQuery request, CancellationToken cancellationToken)
    {
        var userId = int.Parse(
            _httpContextAccessor.HttpContext!.User
                .FindFirstValue(ClaimTypes.NameIdentifier)!);

        var customer = await _context.Customers
            .Where(c => c.Id == request.CustomerId && c.UserId == userId)
            .FirstOrDefaultAsync(cancellationToken);

        if (customer is null) return null;

        // Fetch credit sales and abonos as ledger entries separately so each maps cleanly.
        var creditSales = await _context.Sales
            .Where(s => s.CustomerId == request.CustomerId && s.IsCredit)
            .Select(s => new LedgerEntryDto(s.SaleDate, "credit_sale", s.TotalAmount, null))
            .ToListAsync(cancellationToken);

        var abonos = await _context.Abonos
            .Where(a => a.CustomerId == request.CustomerId)
            .Select(a => new LedgerEntryDto(a.AbonoDate, "abono", a.Amount, a.Note))
            .ToListAsync(cancellationToken);

        var balance = creditSales.Sum(e => e.Amount) - abonos.Sum(e => e.Amount);
        var ledger  = creditSales.Concat(abonos).OrderBy(e => e.Date).ToList();

        return new CustomerDetailDto(customer.Id, customer.Name, customer.Phone, customer.Note, balance, ledger);
    }
}
