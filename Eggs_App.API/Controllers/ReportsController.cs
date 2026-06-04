using Eggs_App.API.Features.Reports.GetMonthlyReport;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Eggs_App.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize] // Requires valid JWT token
public class ReportsController : ControllerBase
{
    private readonly IMediator _mediator;

    public ReportsController(IMediator mediator)
    {
        _mediator = mediator;
    }

    // GET /api/Reports?month=&year= — returns full monthly financial report
    [HttpGet]
    public async Task<IActionResult> GetMonthlyReport([FromQuery] int month, [FromQuery] int year)
    {
        var report = await _mediator.Send(new GetMonthlyReportQuery(month, year));
        return Ok(report);
    }
}