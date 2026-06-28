using MediatR;

namespace Eggs_App.API.Features.Customers.GetCustomerDetail;

public record LedgerEntryDto(DateTime Date, string Type, decimal Amount, string? Note);

public record CustomerDetailDto(
    int Id,
    string Name,
    string? Phone,
    string? Note,
    decimal Balance,
    List<LedgerEntryDto> Ledger
);

/// <summary>Returns full detail for a single customer, including ledger. Returns null if not found.</summary>
public record GetCustomerDetailQuery(int CustomerId) : IRequest<CustomerDetailDto?>;
