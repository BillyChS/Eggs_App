using MediatR;

namespace Eggs_App.API.Features.Categories.GetCategories;

public record CategoryDto(int Id, string Name);
public record GetCategoriesQuery : IRequest<IReadOnlyList<CategoryDto>>;
