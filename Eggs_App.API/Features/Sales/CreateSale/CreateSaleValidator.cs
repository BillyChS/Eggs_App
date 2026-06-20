using Eggs_App.API.Infrastructure.Data.Entities;
using FluentValidation;

namespace Eggs_App.API.Features.Sales.CreateSale;

public class CreateSaleValidator : AbstractValidator<CreateSaleCommand>
{
    public CreateSaleValidator()
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

        RuleFor(x => x.CustomerName)
            .NotEmpty()
            .WithMessage("El nombre del cliente es requerido para ventas pendientes.")
            .When(x => x.PaymentStatus == PaymentStatus.Pending);
    }
}