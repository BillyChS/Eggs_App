using Eggs_App.API.Infrastructure.Data;
using MediatR;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

namespace Eggs_App.API.Features.Sales.UpdateSale;

public class UpdateSaleHandler : IRequestHandler<UpdateSaleCommand, bool>
{
    private readonly AppDbContext _context;
    private readonly IHttpContextAccessor _httpContextAccessor;

    public UpdateSaleHandler(AppDbContext context, IHttpContextAccessor httpContextAccessor)
    {
        _context = context;
        _httpContextAccessor = httpContextAccessor;
    }

    public async Task<bool> Handle(UpdateSaleCommand request, CancellationToken cancellationToken)
    {
        var userId = int.Parse(
            _httpContextAccessor.HttpContext!.User
                .FindFirstValue(ClaimTypes.NameIdentifier)!);

        var sale = await _context.Sales
            .FirstOrDefaultAsync(s => s.Id == request.Id && s.UserId == userId, cancellationToken);

        if (sale is null) return false;

        sale.CartonType     = request.CartonType;
        sale.Quantity       = request.Quantity;
        sale.PricePerCarton = request.PricePerCarton;
        sale.TotalAmount    = request.Quantity * request.PricePerCarton;

        await _context.SaveChangesAsync(cancellationToken);
        return true;
    }
}
