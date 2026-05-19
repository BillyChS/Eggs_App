using Eggs_App.API.Infrastructure.Data;
using MediatR;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

namespace Eggs_App.API.Features.Sales.GetSales;

public class GetSalesHandler : IRequestHandler<GetSalesQuery, List<SaleDto>>
{
    private readonly AppDbContext _context;
    private readonly IHttpContextAccessor _httpContextAccessor;

    public GetSalesHandler(AppDbContext context, IHttpContextAccessor httpContextAccessor)
    {
        _context = context;
        _httpContextAccessor = httpContextAccessor;
    }

    public async Task<List<SaleDto>> Handle(GetSalesQuery request, CancellationToken cancellationToken)
    {
        var userId = int.Parse(
            _httpContextAccessor.HttpContext!.User
                .FindFirstValue(ClaimTypes.NameIdentifier)!);

        return await _context.Sales
            .Where(s => s.UserId == userId
                     && s.SaleDate.Month == request.Month
                     && s.SaleDate.Year == request.Year)
            .OrderByDescending(s => s.SaleDate)
            .Select(s => new SaleDto(
                s.Id,
                s.CartonType,
                s.Quantity,
                s.PricePerCarton,
                s.TotalAmount,
                s.SaleDate))
            .ToListAsync(cancellationToken);
    }
}