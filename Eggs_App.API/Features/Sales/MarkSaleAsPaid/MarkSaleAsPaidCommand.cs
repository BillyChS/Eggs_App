using MediatR;

namespace Eggs_App.API.Features.Sales.MarkSaleAsPaid;

public record MarkSaleAsPaidCommand(int Id) : IRequest<bool>;
