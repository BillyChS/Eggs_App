using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Eggs_App.API.Features.Auth.Login;
using Eggs_App.API.Features.Auth.Register;
using MediatR;

namespace Eggs_App.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly IMediator _mediator;

        public AuthController(IMediator mediator)
        {
            _mediator = mediator;
        }

        // Only an already-authenticated Admin can provision new users —
        // registration must never be reachable by an anonymous caller.
        [Authorize(Roles = "Admin")]
        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] RegisterCommand command)
        {
            var result = await _mediator.Send(command);
            return Ok(result);
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginCommand command)
        {
            var token = await _mediator.Send(command);
            return Ok(new { token });
        }
    }
}
