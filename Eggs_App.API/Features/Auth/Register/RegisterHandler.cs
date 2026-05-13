using Eggs_App.API.Infrastructure.Data;
using Eggs_App.API.Infrastructure.Data.Entities;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Eggs_App.API.Features.Auth.Register;

public class RegisterHandler : IRequestHandler<RegisterCommand, string>
{
    private readonly AppDbContext _context;

    public RegisterHandler(AppDbContext context)
    {
        _context = context;
    }

    public async Task<string> Handle(RegisterCommand request, CancellationToken cancellationToken)
    {
        var exists = await _context.Users
            .AnyAsync(u => u.Username == request.Username, cancellationToken);

        if (exists)
            throw new Exception("El nombre de usuario ya está en uso.");

        var user = new User
        {
            Username = request.Username,
            PasswordHash = BCrypt.Net.BCrypt.HashPassword(request.Password),
            Role = request.Role
        };

        _context.Users.Add(user);
        await _context.SaveChangesAsync(cancellationToken);

        return "Usuario registrado exitosamente.";
    }
}