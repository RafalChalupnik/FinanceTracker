using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace FinanceTracker.Core.Migrations
{
    /// <inheritdoc />
    public partial class RenamedWalletTargetsToHistoricTargets : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_WalletTargets_Groups_GroupId",
                table: "WalletTargets");

            migrationBuilder.DropPrimaryKey(
                name: "PK_WalletTargets",
                table: "WalletTargets");

            migrationBuilder.RenameTable(
                name: "WalletTargets",
                newName: "HistoricTargets");

            migrationBuilder.RenameIndex(
                name: "IX_WalletTargets_GroupId",
                table: "HistoricTargets",
                newName: "IX_HistoricTargets_GroupId");

            migrationBuilder.AddPrimaryKey(
                name: "PK_HistoricTargets",
                table: "HistoricTargets",
                column: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_HistoricTargets_Groups_GroupId",
                table: "HistoricTargets",
                column: "GroupId",
                principalTable: "Groups",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_HistoricTargets_Groups_GroupId",
                table: "HistoricTargets");

            migrationBuilder.DropPrimaryKey(
                name: "PK_HistoricTargets",
                table: "HistoricTargets");

            migrationBuilder.RenameTable(
                name: "HistoricTargets",
                newName: "WalletTargets");

            migrationBuilder.RenameIndex(
                name: "IX_HistoricTargets_GroupId",
                table: "WalletTargets",
                newName: "IX_WalletTargets_GroupId");

            migrationBuilder.AddPrimaryKey(
                name: "PK_WalletTargets",
                table: "WalletTargets",
                column: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_WalletTargets_Groups_GroupId",
                table: "WalletTargets",
                column: "GroupId",
                principalTable: "Groups",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
