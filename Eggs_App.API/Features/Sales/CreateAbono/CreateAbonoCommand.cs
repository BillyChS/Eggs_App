using MediatR;

namespace Eggs_App.API.Features.Sales.CreateAbono;

public record AbonoCreatedDto(int Id, decimal Amount, DateTime AbonoDate, decimal RemainingBalance);

public record CreateAbonoBody(decimal Amount, string? Note);

public record CreateAbonoCommand(int SaleId, decimal Amount, string? Note) : IRequest<AbonoCreatedDto?>;
