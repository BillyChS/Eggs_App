using MediatR;

namespace Eggs_App.API.Features.Customers.GetCustomerDetail;

public record AbonoDto(int Id, decimal Amount, DateTime AbonoDate, string? Note);

public record PendingSaleDetailDto(
    int Id,
    DateTime SaleDate,
    int CartonType,
    int Quantity,
    decimal TotalAmount,
    decimal AbonosTotal,
    decimal RemainingBalance,
    List<AbonoDto> Abonos
);

public record CustomerDetailDto(
    int Id,
    string Name,
    string? Phone,
    string? Note,
    decimal TotalBalance,
    List<PendingSaleDetailDto> PendingSales
);

/// <summary>Returns full detail for a single customer with their pending credit sales and abonos.</summary>
public record GetCustomerDetailQuery(int CustomerId) : IRequest<CustomerDetailDto?>;
