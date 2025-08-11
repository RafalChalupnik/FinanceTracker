using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace FinanceTracker.Core.Migrations
{
    /// <inheritdoc />
    public partial class AddedPhysicalAllocationToWalletComponent : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<Guid>(
                name: "DefaultPhysicalAllocationId",
                table: "Components",
                type: "TEXT",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_Components_DefaultPhysicalAllocationId",
                table: "Components",
                column: "DefaultPhysicalAllocationId");

            migrationBuilder.AddForeignKey(
                name: "FK_Components_PhysicalAllocation_DefaultPhysicalAllocationId",
                table: "Components",
                column: "DefaultPhysicalAllocationId",
                principalTable: "PhysicalAllocation",
                principalColumn: "Id",
                onDelete: ReferentialAction.SetNull);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Components_PhysicalAllocation_DefaultPhysicalAllocationId",
                table: "Components");

            migrationBuilder.DropIndex(
                name: "IX_Components_DefaultPhysicalAllocationId",
                table: "Components");

            migrationBuilder.DropColumn(
                name: "DefaultPhysicalAllocationId",
                table: "Components");
        }
    }
}
