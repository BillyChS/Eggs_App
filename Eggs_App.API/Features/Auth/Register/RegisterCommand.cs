using MediatR;

namespace Eggs_App.API.Features.Auth.Register;

public record RegisterCommand(
    string Username,
    string Password,
    string Role = "Admin"
) : IRequest<string>;