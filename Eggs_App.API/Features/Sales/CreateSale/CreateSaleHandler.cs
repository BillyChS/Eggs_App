using Eggs_App.API.Infrastructure.Data;
using Eggs_App.API.Infrastructure.Data.Entities;
using MediatR;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
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

        // For credit sales, look up or create the Customer record so balances can be tracked.
        Customer? customer = null;
        if (request.PaymentStatus == PaymentStatus.Pending && !string.IsNullOrWhiteSpace(request.CustomerName))
        {
            customer = await _context.Customers
                .FirstOrDefaultAsync(
                    c => c.UserId == userId && c.Name == request.CustomerName,
                    cancellationToken);

            if (customer is null)
            {
                customer = new Customer { Name = request.CustomerName, UserId = userId };
                _context.Customers.Add(customer);
            }
        }

        var sale = new Sale
        {
            CartonType = request.CartonType,
            Quantity = request.Quantity,
            PricePerCarton = request.PricePerCarton,
            TotalAmount = request.Quantity * request.PricePerCarton,
            SaleDate = DateTime.Now,
            PaymentStatus = request.PaymentStatus,
            CustomerName = request.PaymentStatus == PaymentStatus.Pending ? request.CustomerName : null,
            PaidDate = request.PaymentStatus == PaymentStatus.Paid ? DateTime.Now : null,
            IsCredit = request.PaymentStatus == PaymentStatus.Pending,
            UserId = userId,
            Customer = customer,
        };

        _context.Sales.Add(sale);
        await _context.SaveChangesAsync(cancellationToken);

        return sale.Id;
    }
}
