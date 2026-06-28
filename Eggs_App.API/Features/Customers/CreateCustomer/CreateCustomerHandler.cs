using Eggs_App.API.Infrastructure.Data;
using Eggs_App.API.Infrastructure.Data.Entities;
using MediatR;
using Microsoft.AspNetCore.Http;
using System.Security.Claims;

namespace Eggs_App.API.Features.Customers.CreateCustomer;

public class CreateCustomerHandler : IRequestHandler<CreateCustomerCommand, CustomerCreatedDto>
{
    private readonly AppDbContext _context;
    private readonly IHttpContextAccessor _httpContextAccessor;

    public CreateCustomerHandler(AppDbContext context, IHttpContextAccessor httpContextAccessor)
    {
        _context = context;
        _httpContextAccessor = httpContextAccessor;
    }

    public async Task<CustomerCreatedDto> Handle(CreateCustomerCommand request, CancellationToken cancellationToken)
    {
        var userId = int.Parse(
            _httpContextAccessor.HttpContext!.User
                .FindFirstValue(ClaimTypes.NameIdentifier)!);

        var customer = new Customer
        {
            UserId      = userId,
            Name        = request.Name.Trim(),
            Phone       = request.Phone?.Trim(),
            Note        = request.Note?.Trim(),
            CreatedDate = DateTime.Now,
        };

        _context.Customers.Add(customer);
        await _context.SaveChangesAsync(cancellationToken);

        return new CustomerCreatedDto(customer.Id, customer.Name, customer.Phone, customer.Note, customer.CreatedDate);
    }
}
