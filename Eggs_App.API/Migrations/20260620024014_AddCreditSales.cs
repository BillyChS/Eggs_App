using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Eggs_App.API.Migrations
{
    /// <inheritdoc />
    public partial class AddCreditSales : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "CustomerName",
                table: "Sales",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "PaidDate",
                table: "Sales",
                type: "datetime2",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "PaymentStatus",
                table: "Sales",
                type: "int",
                nullable: false,
                defaultValue: 0);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "CustomerName",
                table: "Sales");

            migrationBuilder.DropColumn(
                name: "PaidDate",
                table: "Sales");

            migrationBuilder.DropColumn(
                name: "PaymentStatus",
                table: "Sales");
        }
    }
}
