using MediatR;

namespace Eggs_App.API.Features.Sales.UpdateSale;

public record UpdateSaleBody(int CartonType, int Quantity, decimal PricePerCarton);

public record UpdateSaleCommand(int Id, int CartonType, int Quantity, decimal PricePerCarton)
    : IRequest<bool>;
