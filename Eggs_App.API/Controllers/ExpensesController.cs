using Eggs_App.API.Features.Expenses.CreateExpense;
using Eggs_App.API.Features.Expenses.GetExpenses;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Eggs_App.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize] // All endpoints require a valid JWT token
public class ExpensesController : ControllerBase
{
    private readonly IMediator _mediator;

    public ExpensesController(IMediator mediator)
    {
        _mediator = mediator;
    }

    // POST /api/Expenses — create a new expense
    [HttpPost]
    public async Task<IActionResult> CreateExpense([FromBody] CreateExpenseCommand command)
    {
        var id = await _mediator.Send(command);
        return Ok(new { id });
    }

    // GET /api/Expenses?month=&year= — get expenses for a given month
    [HttpGet]
    public async Task<IActionResult> GetExpenses([FromQuery] int month, [FromQuery] int year)
    {
        var expenses = await _mediator.Send(new GetExpensesQuery(month, year));
        return Ok(expenses);
    }
}