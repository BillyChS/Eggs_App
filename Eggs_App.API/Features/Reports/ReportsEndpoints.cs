using System.Security.Claims;
using MediatR;

namespace Eggs_App.API.Features.Reports;

public static class ReportsEndpoints
{
    public static void MapReportsEndpoints(this IEndpointRouteBuilder app)
    {
        app.MapGet("/api/reports/summary", async (
            int month,
            int year,
            ISender sender,
            ClaimsPrincipal user,
            CancellationToken ct) =>
        {
            // Validation -> 400 on bad input.
            if (month is < 1 or > 12)
                return Results.BadRequest("Month must be between 1 and 12.");
            if (year is < 2000 or > 2100)
                return Results.BadRequest("Year is out of the allowed range.");

            // Extract the user id from the JWT claims.
            var userId = int.Parse(user.FindFirstValue(ClaimTypes.NameIdentifier)!);

            var result = await sender.Send(
                new GetMonthlySummary.Query(month, year, userId), ct);

            return Results.Ok(result);
        })
        .RequireAuthorization()
        .WithName("GetMonthlySummary");
    }
}