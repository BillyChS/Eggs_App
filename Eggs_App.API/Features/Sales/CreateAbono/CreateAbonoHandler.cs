using Eggs_App.API.Infrastructure.Data;
using Eggs_App.API.Infrastructure.Data.Entities;
using MediatR;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

namespace Eggs_App.API.Features.Sales.CreateAbono;

public class CreateAbonoHandler : IRequestHandler<CreateAbonoCommand, AbonoCreatedDto?>
{
    private readonly AppDbContext _context;
    private readonly IHttpContextAccessor _httpContextAccessor;

    public CreateAbonoHandler(AppDbContext context, IHttpContextAccessor httpContextAccessor)
    {
        _context = context;
        _httpContextAccessor = httpContextAccessor;
    }

    public async Task<AbonoCreatedDto?> Handle(CreateAbonoCommand request, CancellationToken cancellationToken)
    {
        var userId = int.Parse(
            _httpContextAccessor.HttpContext!.User
                .FindFirstValue(ClaimTypes.NameIdentifier)!);

        var sale = await _context.Sales
            .Include(s => s.Abonos)
            .FirstOrDefaultAsync(
                s => s.Id == request.SaleId && s.UserId == userId && s.IsCredit,
                cancellationToken);

        if (sale is null) return null;

        var currentTotal = sale.Abonos.Sum(a => a.Amount);
        var remaining = sale.TotalAmount - currentTotal;

        // Clamp to remaining balance so the caller never overpays.
        var amount = Math.Min(request.Amount, remaining);

        var abono = new Abono
        {
            SaleId = sale.Id,
            Amount = amount,
            Note = request.Note,
            AbonoDate = DateTime.Now,
        };

        _context.Abonos.Add(abono);

        var newRemaining = remaining - amount;
        if (newRemaining == 0)
        {
            sale.PaymentStatus = PaymentStatus.Paid;
            sale.PaidDate = DateTime.Now;
        }

        await _context.SaveChangesAsync(cancellationToken);

        return new AbonoCreatedDto(abono.Id, abono.Amount, abono.AbonoDate, newRemaining);
    }
}
