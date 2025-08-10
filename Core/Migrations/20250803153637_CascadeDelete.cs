using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace FinanceTracker.Core.Migrations
{
    /// <inheritdoc />
    public partial class CascadeDelete : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_HistoricValues_Assets_AssetId",
                table: "HistoricValues");

            migrationBuilder.DropForeignKey(
                name: "FK_HistoricValues_Components_ComponentId",
                table: "HistoricValues");

            migrationBuilder.DropForeignKey(
                name: "FK_HistoricValues_Debts_DebtId",
                table: "HistoricValues");

            migrationBuilder.AddForeignKey(
                name: "FK_HistoricValues_Assets_AssetId",
                table: "HistoricValues",
                column: "AssetId",
                principalTable: "Assets",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_HistoricValues_Components_ComponentId",
                table: "HistoricValues",
                column: "ComponentId",
                principalTable: "Components",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_HistoricValues_Debts_DebtId",
                table: "HistoricValues",
                column: "DebtId",
                principalTable: "Debts",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_HistoricValues_Assets_AssetId",
                table: "HistoricValues");

            migrationBuilder.DropForeignKey(
                name: "FK_HistoricValues_Components_ComponentId",
                table: "HistoricValues");

            migrationBuilder.DropForeignKey(
                name: "FK_HistoricValues_Debts_DebtId",
                table: "HistoricValues");

            migrationBuilder.AddForeignKey(
                name: "FK_HistoricValues_Assets_AssetId",
                table: "HistoricValues",
                column: "AssetId",
                principalTable: "Assets",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_HistoricValues_Components_ComponentId",
                table: "HistoricValues",
                column: "ComponentId",
                principalTable: "Components",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_HistoricValues_Debts_DebtId",
                table: "HistoricValues",
                column: "DebtId",
                principalTable: "Debts",
                principalColumn: "Id");
        }
    }
}
