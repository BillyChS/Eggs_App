using Eggs_App.API.Features.Sales.CreateSale;
using Eggs_App.API.Features.Sales.GetSales;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Eggs_App.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class SalesController : ControllerBase
{
    private readonly IMediator _mediator;

    public SalesController(IMediator mediator)
    {
        _mediator = mediator;
    }

    [HttpPost]
    public async Task<IActionResult> CreateSale([FromBody] CreateSaleCommand command)
    {
        var id = await _mediator.Send(command);
        return Ok(new { id });
    }

    [HttpGet]
    public async Task<IActionResult> GetSales([FromQuery] int month, [FromQuery] int year)
    {
        var sales = await _mediator.Send(new GetSalesQuery(month, year));
        return Ok(sales);
    }
}