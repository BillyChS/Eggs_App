using MediatR;

namespace Eggs_App.API.Features.Customers.GetCustomers;

public record CustomerDto(int Id, string Name, string? Phone, decimal Balance);

/// <summary>
/// Returns all customers for the authenticated user with their outstanding balance.
/// Pass <c>WithBalance = true</c> to retrieve only customers with balance &gt; 0,
/// ordered by balance descending (accounts-receivable view).
/// </summary>
public record GetCustomersQuery(bool? WithBalance) : IRequest<List<CustomerDto>>;
