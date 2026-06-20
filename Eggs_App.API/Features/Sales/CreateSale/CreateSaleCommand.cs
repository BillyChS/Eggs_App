using Eggs_App.API.Infrastructure.Data.Entities;
using MediatR;

namespace Eggs_App.API.Features.Sales.CreateSale;

public record CreateSaleCommand(
    int CartonType,
    int Quantity,
    decimal PricePerCarton,
    PaymentStatus PaymentStatus = PaymentStatus.Paid,
    string? CustomerName = null
) : IRequest<int>;