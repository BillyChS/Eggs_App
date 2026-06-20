using Eggs_App.API.Infrastructure.Data.Entities;
using MediatR;

namespace Eggs_App.API.Features.Sales.GetSales;

public record SaleDto(
    int Id,
    int CartonType,
    int Quantity,
    decimal PricePerCarton,
    decimal TotalAmount,
    DateTime SaleDate,
    PaymentStatus PaymentStatus,
    string? CustomerName,
    DateTime? PaidDate
);

public record GetSalesQuery(int Month, int Year) : IRequest<List<SaleDto>>;