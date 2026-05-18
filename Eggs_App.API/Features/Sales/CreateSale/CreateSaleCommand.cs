using MediatR;

namespace Eggs_App.API.Features.Sales.CreateSale;

public record CreateSaleCommand(
    int CartonType,
    int Quantity,
    decimal PricePerCarton
) : IRequest<int>;