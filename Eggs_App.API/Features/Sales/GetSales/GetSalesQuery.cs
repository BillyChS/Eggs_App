using MediatR;

namespace Eggs_App.API.Features.Sales.GetSales;

public record SaleDto(
    int Id,
    int CartonType,
    int Quantity,
    decimal PricePerCarton,
    decimal TotalAmount,
    DateTime SaleDate
);

public record GetSalesQuery(int Month, int Year) : IRequest<List<SaleDto>>;