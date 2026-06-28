using FluentValidation;

namespace Eggs_App.API.Features.Sales.CreateAbono;

public class CreateAbonoValidator : AbstractValidator<CreateAbonoCommand>
{
    public CreateAbonoValidator()
    {
        RuleFor(x => x.Amount)
            .GreaterThan(0).WithMessage("El monto del abono debe ser mayor a cero.");
        RuleFor(x => x.Note)
            .MaximumLength(300).When(x => x.Note is not null);
    }
}
