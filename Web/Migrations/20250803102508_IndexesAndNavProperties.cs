using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace FinanceTracker.Web.Migrations
{
    /// <inheritdoc />
    public partial class IndexesAndNavProperties : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Components_Wallets_WalletId",
                table: "Components");

            migrationBuilder.AlterColumn<Guid>(
                name: "WalletId",
                table: "Components",
                type: "TEXT",
                nullable: false,
                defaultValue: new Guid("00000000-0000-0000-0000-000000000000"),
                oldClrType: typeof(Guid),
                oldType: "TEXT",
                oldNullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_Wallets_Name",
                table: "Wallets",
                column: "Name",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Debts_Name",
                table: "Debts",
                column: "Name",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Components_Id_Name",
                table: "Components",
                columns: new[] { "Id", "Name" },
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Assets_Name",
                table: "Assets",
                column: "Name",
                unique: true);

            migrationBuilder.AddForeignKey(
                name: "FK_Components_Wallets_WalletId",
                table: "Components",
                column: "WalletId",
                principalTable: "Wallets",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Components_Wallets_WalletId",
                table: "Components");

            migrationBuilder.DropIndex(
                name: "IX_Wallets_Name",
                table: "Wallets");

            migrationBuilder.DropIndex(
                name: "IX_Debts_Name",
                table: "Debts");

            migrationBuilder.DropIndex(
                name: "IX_Components_Id_Name",
                table: "Components");

            migrationBuilder.DropIndex(
                name: "IX_Assets_Name",
                table: "Assets");

            migrationBuilder.AlterColumn<Guid>(
                name: "WalletId",
                table: "Components",
                type: "TEXT",
                nullable: true,
                oldClrType: typeof(Guid),
                oldType: "TEXT");

            migrationBuilder.AddForeignKey(
                name: "FK_Components_Wallets_WalletId",
                table: "Components",
                column: "WalletId",
                principalTable: "Wallets",
                principalColumn: "Id");
        }
    }
}
