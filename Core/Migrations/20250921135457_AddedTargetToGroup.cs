using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace FinanceTracker.Core.Migrations
{
    /// <inheritdoc />
    public partial class AddedTargetToGroup : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<Guid>(
                name: "GroupId",
                table: "WalletTargets",
                type: "TEXT",
                nullable: false,
                defaultValue: new Guid("00000000-0000-0000-0000-000000000000"));

            migrationBuilder.CreateIndex(
                name: "IX_WalletTargets_GroupId",
                table: "WalletTargets",
                column: "GroupId");

            migrationBuilder.AddForeignKey(
                name: "FK_WalletTargets_Groups_GroupId",
                table: "WalletTargets",
                column: "GroupId",
                principalTable: "Groups",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.Sql(@"
                update WalletTargets
                set GroupId = WalletId;
            ");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_WalletTargets_Groups_GroupId",
                table: "WalletTargets");

            migrationBuilder.DropIndex(
                name: "IX_WalletTargets_GroupId",
                table: "WalletTargets");

            migrationBuilder.DropColumn(
                name: "GroupId",
                table: "WalletTargets");
        }
    }
}
