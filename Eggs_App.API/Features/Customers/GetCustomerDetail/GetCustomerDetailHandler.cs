using Eggs_App.API.Infrastructure.Data;
using Eggs_App.API.Infrastructure.Data.Entities;
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

        var pendingSales = await _context.Sales
            .Where(s => s.CustomerId == request.CustomerId
                     && s.UserId == userId
                     && s.IsCredit
                     && s.PaymentStatus == PaymentStatus.Pending)
            .Include(s => s.Abonos)
            .OrderBy(s => s.SaleDate)
            .ToListAsync(cancellationToken);

        var saleDetails = pendingSales.Select(s =>
        {
            var abonosTotal = s.Abonos.Sum(a => a.Amount);
            return new PendingSaleDetailDto(
                s.Id,
                s.SaleDate,
                s.CartonType,
                s.Quantity,
                s.TotalAmount,
                abonosTotal,
                s.TotalAmount - abonosTotal,
                s.Abonos
                    .OrderBy(a => a.AbonoDate)
                    .Select(a => new AbonoDto(a.Id, a.Amount, a.AbonoDate, a.Note))
                    .ToList()
            );
        }).ToList();

        var totalBalance = saleDetails.Sum(s => s.RemainingBalance);

        return new CustomerDetailDto(
            customer.Id,
            customer.Name,
            customer.Phone,
            customer.Note,
            totalBalance,
            saleDetails
        );
    }
}
