using Eggs_App.API.Infrastructure.Data;
using Eggs_App.API.Infrastructure.Data.Entities;
using MediatR;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

namespace Eggs_App.API.Features.Sales.MarkSaleAsPaid;

public class MarkSaleAsPaidHandler : IRequestHandler<MarkSaleAsPaidCommand, bool>
{
    private readonly AppDbContext _context;
    private readonly IHttpContextAccessor _httpContextAccessor;

    public MarkSaleAsPaidHandler(AppDbContext context, IHttpContextAccessor httpContextAccessor)
    {
        _context = context;
        _httpContextAccessor = httpContextAccessor;
    }

    public async Task<bool> Handle(MarkSaleAsPaidCommand request, CancellationToken cancellationToken)
    {
        var userId = int.Parse(
            _httpContextAccessor.HttpContext!.User
                .FindFirstValue(ClaimTypes.NameIdentifier)!);

        var sale = await _context.Sales
            .FirstOrDefaultAsync(s => s.Id == request.Id && s.UserId == userId, cancellationToken);

        if (sale is null) return false;

        sale.PaymentStatus = PaymentStatus.Paid;
        sale.PaidDate = DateTime.Now;
        await _context.SaveChangesAsync(cancellationToken);
        return true;
    }
}
