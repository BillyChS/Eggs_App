using Eggs_App.API.Infrastructure.Data;
using Eggs_App.API.Infrastructure.Data.Entities;
using MediatR;
using Microsoft.AspNetCore.Http;
using System.Security.Claims;

namespace Eggs_App.API.Features.Sales.CreateSale;

public class CreateSaleHandler : IRequestHandler<CreateSaleCommand, int>
{
    private readonly AppDbContext _context;
    private readonly IHttpContextAccessor _httpContextAccessor;

    public CreateSaleHandler(AppDbContext context, IHttpContextAccessor httpContextAccessor)
    {
        _context = context;
        _httpContextAccessor = httpContextAccessor;
    }

    public async Task<int> Handle(CreateSaleCommand request, CancellationToken cancellationToken)
    {
        var userId = int.Parse(
            _httpContextAccessor.HttpContext!.User
                .FindFirstValue(ClaimTypes.NameIdentifier)!);

        var sale = new Sale
        {
            CartonType = request.CartonType,
            Quantity = request.Quantity,
            PricePerCarton = request.PricePerCarton,
            TotalAmount = request.Quantity * request.PricePerCarton,
            // Use local time instead of UTC to avoid timezone issues
            SaleDate = DateTime.Now,
            UserId = userId
        };

        _context.Sales.Add(sale);
        await _context.SaveChangesAsync(cancellationToken);

        return sale.Id;
    }
}