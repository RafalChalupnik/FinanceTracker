using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace FinanceTracker.Core.Migrations
{
    /// <inheritdoc />
    public partial class AddedComponentsToGroup : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<Guid>(
                name: "WalletId",
                table: "Components",
                type: "TEXT",
                nullable: true,
                oldClrType: typeof(Guid),
                oldType: "TEXT");

            migrationBuilder.AddColumn<Guid>(
                name: "GroupId",
                table: "Components",
                type: "TEXT",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_Components_GroupId",
                table: "Components",
                column: "GroupId");

            migrationBuilder.AddForeignKey(
                name: "FK_Components_Groups_GroupId",
                table: "Components",
                column: "GroupId",
                principalTable: "Groups",
                principalColumn: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Components_Groups_GroupId",
                table: "Components");

            migrationBuilder.DropIndex(
                name: "IX_Components_GroupId",
                table: "Components");

            migrationBuilder.DropColumn(
                name: "GroupId",
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
        }
    }
}
