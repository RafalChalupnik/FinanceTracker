using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace FinanceTracker.Core.Migrations
{
    /// <inheritdoc />
    public partial class DroppedOldFKs : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Components_Wallets_WalletId",
                table: "Components");

            migrationBuilder.DropForeignKey(
                name: "FK_HistoricValues_Assets_AssetId",
                table: "HistoricValues");

            migrationBuilder.DropForeignKey(
                name: "FK_HistoricValues_Debts_DebtId",
                table: "HistoricValues");

            migrationBuilder.DropForeignKey(
                name: "FK_WalletTargets_Wallets_WalletId",
                table: "WalletTargets");

            migrationBuilder.DropIndex(
                name: "IX_WalletTargets_WalletId",
                table: "WalletTargets");

            migrationBuilder.DropIndex(
                name: "IX_HistoricValues_AssetId",
                table: "HistoricValues");

            migrationBuilder.DropIndex(
                name: "IX_HistoricValues_DebtId",
                table: "HistoricValues");

            migrationBuilder.DropIndex(
                name: "IX_Components_WalletId",
                table: "Components");

            migrationBuilder.DropColumn(
                name: "WalletId",
                table: "WalletTargets");

            migrationBuilder.DropColumn(
                name: "AssetId",
                table: "HistoricValues");

            migrationBuilder.DropColumn(
                name: "DebtId",
                table: "HistoricValues");

            migrationBuilder.DropColumn(
                name: "WalletId",
                table: "Components");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<Guid>(
                name: "WalletId",
                table: "WalletTargets",
                type: "TEXT",
                nullable: false,
                defaultValue: new Guid("00000000-0000-0000-0000-000000000000"));

            migrationBuilder.AddColumn<Guid>(
                name: "AssetId",
                table: "HistoricValues",
                type: "TEXT",
                nullable: true);

            migrationBuilder.AddColumn<Guid>(
                name: "DebtId",
                table: "HistoricValues",
                type: "TEXT",
                nullable: true);

            migrationBuilder.AddColumn<Guid>(
                name: "WalletId",
                table: "Components",
                type: "TEXT",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_WalletTargets_WalletId",
                table: "WalletTargets",
                column: "WalletId");

            migrationBuilder.CreateIndex(
                name: "IX_HistoricValues_AssetId",
                table: "HistoricValues",
                column: "AssetId");

            migrationBuilder.CreateIndex(
                name: "IX_HistoricValues_DebtId",
                table: "HistoricValues",
                column: "DebtId");

            migrationBuilder.CreateIndex(
                name: "IX_Components_WalletId",
                table: "Components",
                column: "WalletId");

            migrationBuilder.AddForeignKey(
                name: "FK_Components_Wallets_WalletId",
                table: "Components",
                column: "WalletId",
                principalTable: "Wallets",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_HistoricValues_Assets_AssetId",
                table: "HistoricValues",
                column: "AssetId",
                principalTable: "Assets",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_HistoricValues_Debts_DebtId",
                table: "HistoricValues",
                column: "DebtId",
                principalTable: "Debts",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_WalletTargets_Wallets_WalletId",
                table: "WalletTargets",
                column: "WalletId",
                principalTable: "Wallets",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
