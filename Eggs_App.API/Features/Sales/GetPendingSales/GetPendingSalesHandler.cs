using Eggs_App.API.Infrastructure.Data;
using Eggs_App.API.Infrastructure.Data.Entities;
using MediatR;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

namespace Eggs_App.API.Features.Sales.GetPendingSales;

public class GetPendingSalesHandler : IRequestHandler<GetPendingSalesQuery, List<PendingSaleDto>>
{
    private readonly AppDbContext _context;
    private readonly IHttpContextAccessor _httpContextAccessor;

    public GetPendingSalesHandler(AppDbContext context, IHttpContextAccessor httpContextAccessor)
    {
        _context = context;
        _httpContextAccessor = httpContextAccessor;
    }

    public async Task<List<PendingSaleDto>> Handle(GetPendingSalesQuery request, CancellationToken cancellationToken)
    {
        var userId = int.Parse(
            _httpContextAccessor.HttpContext!.User
                .FindFirstValue(ClaimTypes.NameIdentifier)!);

        return await _context.Sales
            .Where(s => s.UserId == userId && s.PaymentStatus == PaymentStatus.Pending)
            .OrderBy(s => s.SaleDate)
            .Select(s => new PendingSaleDto(
                s.Id,
                s.CustomerName!,
                s.TotalAmount,
                s.SaleDate))
            .ToListAsync(cancellationToken);
    }
}
