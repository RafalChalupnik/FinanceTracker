using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace FinanceTracker.Web.Migrations
{
    /// <inheritdoc />
    public partial class Lol3 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Assets_Portfolios_PortfolioId",
                table: "Assets");

            migrationBuilder.DropForeignKey(
                name: "FK_Debts_Portfolios_PortfolioId",
                table: "Debts");

            migrationBuilder.DropForeignKey(
                name: "FK_Wallets_Portfolios_PortfolioId",
                table: "Wallets");

            migrationBuilder.AlterColumn<Guid>(
                name: "PortfolioId",
                table: "Wallets",
                type: "TEXT",
                nullable: false,
                defaultValue: new Guid("00000000-0000-0000-0000-000000000000"),
                oldClrType: typeof(Guid),
                oldType: "TEXT",
                oldNullable: true);

            migrationBuilder.AlterColumn<Guid>(
                name: "PortfolioId",
                table: "Debts",
                type: "TEXT",
                nullable: false,
                defaultValue: new Guid("00000000-0000-0000-0000-000000000000"),
                oldClrType: typeof(Guid),
                oldType: "TEXT",
                oldNullable: true);

            migrationBuilder.AlterColumn<Guid>(
                name: "PortfolioId",
                table: "Assets",
                type: "TEXT",
                nullable: false,
                defaultValue: new Guid("00000000-0000-0000-0000-000000000000"),
                oldClrType: typeof(Guid),
                oldType: "TEXT",
                oldNullable: true);

            migrationBuilder.AddForeignKey(
                name: "FK_Assets_Portfolios_PortfolioId",
                table: "Assets",
                column: "PortfolioId",
                principalTable: "Portfolios",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Debts_Portfolios_PortfolioId",
                table: "Debts",
                column: "PortfolioId",
                principalTable: "Portfolios",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Wallets_Portfolios_PortfolioId",
                table: "Wallets",
                column: "PortfolioId",
                principalTable: "Portfolios",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Assets_Portfolios_PortfolioId",
                table: "Assets");

            migrationBuilder.DropForeignKey(
                name: "FK_Debts_Portfolios_PortfolioId",
                table: "Debts");

            migrationBuilder.DropForeignKey(
                name: "FK_Wallets_Portfolios_PortfolioId",
                table: "Wallets");

            migrationBuilder.AlterColumn<Guid>(
                name: "PortfolioId",
                table: "Wallets",
                type: "TEXT",
                nullable: true,
                oldClrType: typeof(Guid),
                oldType: "TEXT");

            migrationBuilder.AlterColumn<Guid>(
                name: "PortfolioId",
                table: "Debts",
                type: "TEXT",
                nullable: true,
                oldClrType: typeof(Guid),
                oldType: "TEXT");

            migrationBuilder.AlterColumn<Guid>(
                name: "PortfolioId",
                table: "Assets",
                type: "TEXT",
                nullable: true,
                oldClrType: typeof(Guid),
                oldType: "TEXT");

            migrationBuilder.AddForeignKey(
                name: "FK_Assets_Portfolios_PortfolioId",
                table: "Assets",
                column: "PortfolioId",
                principalTable: "Portfolios",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_Debts_Portfolios_PortfolioId",
                table: "Debts",
                column: "PortfolioId",
                principalTable: "Portfolios",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_Wallets_Portfolios_PortfolioId",
                table: "Wallets",
                column: "PortfolioId",
                principalTable: "Portfolios",
                principalColumn: "Id");
        }
    }
}
