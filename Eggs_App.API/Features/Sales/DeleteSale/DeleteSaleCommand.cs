using MediatR;

namespace Eggs_App.API.Features.Sales.DeleteSale;

public record DeleteSaleCommand(int Id) : IRequest<bool>;
