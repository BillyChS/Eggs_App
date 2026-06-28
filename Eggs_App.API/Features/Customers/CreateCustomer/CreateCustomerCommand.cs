using MediatR;

namespace Eggs_App.API.Features.Customers.CreateCustomer;

public record CustomerCreatedDto(int Id, string Name, string? Phone, string? Note, DateTime CreatedDate);

public record CreateCustomerCommand(
    string Name,
    string? Phone,
    string? Note
) : IRequest<CustomerCreatedDto>;
