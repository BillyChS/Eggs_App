using FluentValidation;

namespace Eggs_App.API.Features.Sales.UpdateSale;

public class UpdateSaleValidator : AbstractValidator<UpdateSaleCommand>
{
    public UpdateSaleValidator()
    {
        RuleFor(x => x.CartonType)
            .Must(x => x == 15 || x == 30)
            .WithMessage("El tipo de cartón debe ser 15 o 30 unidades.");

        RuleFor(x => x.Quantity)
            .GreaterThan(0)
            .WithMessage("La cantidad debe ser mayor a 0.");

        RuleFor(x => x.PricePerCarton)
            .GreaterThan(0)
            .WithMessage("El precio debe ser mayor a 0.");
    }
}
