using Eggs_App.API.Infrastructure.Data;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Eggs_App.API.Features.Categories.GetCategories;

public class GetCategoriesHandler : IRequestHandler<GetCategoriesQuery, IReadOnlyList<CategoryDto>>
{
    private readonly AppDbContext _context;
    public GetCategoriesHandler(AppDbContext context) => _context = context;

    public async Task<IReadOnlyList<CategoryDto>> Handle(GetCategoriesQuery request, CancellationToken ct)
        => await _context.Categories
            .OrderBy(c => c.Id)
            .Select(c => new CategoryDto(c.Id, c.Name))
            .ToListAsync(ct);
}
