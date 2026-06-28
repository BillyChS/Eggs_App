using FluentValidation;

namespace Eggs_App.API.Features.Customers.CreateCustomer;

public class CreateCustomerValidator : AbstractValidator<CreateCustomerCommand>
{
    public CreateCustomerValidator()
    {
        RuleFor(x => x.Name)
            .NotEmpty().WithMessage("El nombre del cliente es requerido.")
            .MaximumLength(100).WithMessage("El nombre no puede superar 100 caracteres.");

        RuleFor(x => x.Phone)
            .MaximumLength(30).WithMessage("El teléfono no puede superar 30 caracteres.")
            .When(x => x.Phone != null);

        RuleFor(x => x.Note)
            .MaximumLength(300).WithMessage("La nota no puede superar 300 caracteres.")
            .When(x => x.Note != null);
    }
}
