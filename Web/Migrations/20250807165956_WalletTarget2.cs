using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace FinanceTracker.Web.Migrations
{
    /// <inheritdoc />
    public partial class WalletTarget2 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_WalletTarget_Wallets_WalletId",
                table: "WalletTarget");

            migrationBuilder.DropPrimaryKey(
                name: "PK_WalletTarget",
                table: "WalletTarget");

            migrationBuilder.RenameTable(
                name: "WalletTarget",
                newName: "WalletTargets");

            migrationBuilder.RenameIndex(
                name: "IX_WalletTarget_WalletId",
                table: "WalletTargets",
                newName: "IX_WalletTargets_WalletId");

            migrationBuilder.AddPrimaryKey(
                name: "PK_WalletTargets",
                table: "WalletTargets",
                column: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_WalletTargets_Wallets_WalletId",
                table: "WalletTargets",
                column: "WalletId",
                principalTable: "Wallets",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_WalletTargets_Wallets_WalletId",
                table: "WalletTargets");

            migrationBuilder.DropPrimaryKey(
                name: "PK_WalletTargets",
                table: "WalletTargets");

            migrationBuilder.RenameTable(
                name: "WalletTargets",
                newName: "WalletTarget");

            migrationBuilder.RenameIndex(
                name: "IX_WalletTargets_WalletId",
                table: "WalletTarget",
                newName: "IX_WalletTarget_WalletId");

            migrationBuilder.AddPrimaryKey(
                name: "PK_WalletTarget",
                table: "WalletTarget",
                column: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_WalletTarget_Wallets_WalletId",
                table: "WalletTarget",
                column: "WalletId",
                principalTable: "Wallets",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
