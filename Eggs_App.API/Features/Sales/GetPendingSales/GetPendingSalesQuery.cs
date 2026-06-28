using MediatR;

namespace Eggs_App.API.Features.Sales.GetPendingSales;

public record PendingSaleDto(
    int Id,
    string CustomerName,
    decimal TotalAmount,
    DateTime SaleDate
);

public record GetPendingSalesQuery : IRequest<List<PendingSaleDto>>;
