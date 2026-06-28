using Eggs_App.API.Features.Customers.CreateCustomer;
using Eggs_App.API.Features.Customers.GetCustomerDetail;
using Eggs_App.API.Features.Customers.GetCustomers;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Eggs_App.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class CustomersController : ControllerBase
{
    private readonly IMediator _mediator;

    public CustomersController(IMediator mediator)
    {
        _mediator = mediator;
    }

    // POST /api/Customers — register a new credit customer
    [HttpPost]
    public async Task<IActionResult> CreateCustomer([FromBody] CreateCustomerCommand command)
    {
        var result = await _mediator.Send(command);
        return Ok(result);
    }

    // GET /api/Customers?withBalance=true — list customers, optionally filtered to outstanding balances
    [HttpGet]
    public async Task<IActionResult> GetCustomers([FromQuery] bool? withBalance)
    {
        var customers = await _mediator.Send(new GetCustomersQuery(withBalance));
        return Ok(customers);
    }

    // GET /api/Customers/{id} — full detail with ledger for a single customer
    [HttpGet("{id}")]
    public async Task<IActionResult> GetCustomerDetail(int id)
    {
        var detail = await _mediator.Send(new GetCustomerDetailQuery(id));
        return detail is null ? NotFound() : Ok(detail);
    }
}
