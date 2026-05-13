using MediatR;

namespace Eggs_App.API.Features.Auth.Login;

public record LoginCommand(
    string Username,
    string Password
) : IRequest<string>;