using FluentValidation;

namespace Eggs_App.API.Features.Expenses.UpdateExpense;

public class UpdateExpenseValidator : AbstractValidator<UpdateExpenseCommand>
{
    public UpdateExpenseValidator()
    {
        RuleFor(x => x.Amount)
            .GreaterThan(0).WithMessage("El monto debe ser mayor a 0.");

        RuleFor(x => x.ExpenseDate)
            .NotEmpty().WithMessage("La fecha es requerida.")
            .Must(d => d.Date <= DateTime.Today).WithMessage("La fecha no puede ser futura.");

        RuleFor(x => x.OtherText)
            .NotEmpty().WithMessage("Especificá el tipo de gasto.")
            .MaximumLength(200).WithMessage("El texto no puede superar 200 caracteres.")
            .When(x => x.CategoryId == null);
    }
}
