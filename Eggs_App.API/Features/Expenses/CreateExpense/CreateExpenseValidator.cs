using FluentValidation;

namespace Eggs_App.API.Features.Expenses.CreateExpense;

public class CreateExpenseValidator : AbstractValidator<CreateExpenseCommand>
{
    public CreateExpenseValidator()
    {
        // Expense name is required
        RuleFor(x => x.Name)
            .NotEmpty().WithMessage("El nombre del gasto es requerido.")
            .MaximumLength(100).WithMessage("El nombre no puede superar 100 caracteres.");

        // Amount must be greater than zero
        RuleFor(x => x.Amount)
            .GreaterThan(0).WithMessage("El monto debe ser mayor a 0.");

        // Description is optional but limited in length
        RuleFor(x => x.Description)
            .MaximumLength(300).WithMessage("La descripción no puede superar 300 caracteres.")
            .When(x => x.Description != null);
    }
}