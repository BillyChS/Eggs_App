using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Eggs_App.API.Migrations
{
    /// <inheritdoc />
    public partial class RewireAbonoToSale : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Abonos_Customers_CustomerId",
                table: "Abonos");

            migrationBuilder.DropForeignKey(
                name: "FK_Abonos_Users_UserId",
                table: "Abonos");

            migrationBuilder.DropIndex(
                name: "IX_Abonos_CustomerId",
                table: "Abonos");

            migrationBuilder.DropColumn(
                name: "CustomerId",
                table: "Abonos");

            migrationBuilder.RenameColumn(
                name: "UserId",
                table: "Abonos",
                newName: "SaleId");

            migrationBuilder.RenameIndex(
                name: "IX_Abonos_UserId",
                table: "Abonos",
                newName: "IX_Abonos_SaleId");

            migrationBuilder.AddForeignKey(
                name: "FK_Abonos_Sales_SaleId",
                table: "Abonos",
                column: "SaleId",
                principalTable: "Sales",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Abonos_Sales_SaleId",
                table: "Abonos");

            migrationBuilder.RenameColumn(
                name: "SaleId",
                table: "Abonos",
                newName: "UserId");

            migrationBuilder.RenameIndex(
                name: "IX_Abonos_SaleId",
                table: "Abonos",
                newName: "IX_Abonos_UserId");

            migrationBuilder.AddColumn<int>(
                name: "CustomerId",
                table: "Abonos",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.CreateIndex(
                name: "IX_Abonos_CustomerId",
                table: "Abonos",
                column: "CustomerId");

            migrationBuilder.AddForeignKey(
                name: "FK_Abonos_Customers_CustomerId",
                table: "Abonos",
                column: "CustomerId",
                principalTable: "Customers",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Abonos_Users_UserId",
                table: "Abonos",
                column: "UserId",
                principalTable: "Users",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }
    }
}
