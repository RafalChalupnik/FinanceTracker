using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace FinanceTracker.Core.Migrations
{
    /// <inheritdoc />
    public partial class AddedComponentLinkToHistoricValue : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Components_PhysicalAllocation_DefaultPhysicalAllocationId",
                table: "Components");

            migrationBuilder.DropForeignKey(
                name: "FK_HistoricValues_PhysicalAllocation_PhysicalAllocationId",
                table: "HistoricValues");

            migrationBuilder.DropPrimaryKey(
                name: "PK_PhysicalAllocation",
                table: "PhysicalAllocation");

            migrationBuilder.RenameTable(
                name: "PhysicalAllocation",
                newName: "PhysicalAllocations");

            migrationBuilder.RenameIndex(
                name: "IX_PhysicalAllocation_Name",
                table: "PhysicalAllocations",
                newName: "IX_PhysicalAllocations_Name");

            migrationBuilder.AddPrimaryKey(
                name: "PK_PhysicalAllocations",
                table: "PhysicalAllocations",
                column: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_Components_PhysicalAllocations_DefaultPhysicalAllocationId",
                table: "Components",
                column: "DefaultPhysicalAllocationId",
                principalTable: "PhysicalAllocations",
                principalColumn: "Id",
                onDelete: ReferentialAction.SetNull);

            migrationBuilder.AddForeignKey(
                name: "FK_HistoricValues_PhysicalAllocations_PhysicalAllocationId",
                table: "HistoricValues",
                column: "PhysicalAllocationId",
                principalTable: "PhysicalAllocations",
                principalColumn: "Id",
                onDelete: ReferentialAction.SetNull);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Components_PhysicalAllocations_DefaultPhysicalAllocationId",
                table: "Components");

            migrationBuilder.DropForeignKey(
                name: "FK_HistoricValues_PhysicalAllocations_PhysicalAllocationId",
                table: "HistoricValues");

            migrationBuilder.DropPrimaryKey(
                name: "PK_PhysicalAllocations",
                table: "PhysicalAllocations");

            migrationBuilder.RenameTable(
                name: "PhysicalAllocations",
                newName: "PhysicalAllocation");

            migrationBuilder.RenameIndex(
                name: "IX_PhysicalAllocations_Name",
                table: "PhysicalAllocation",
                newName: "IX_PhysicalAllocation_Name");

            migrationBuilder.AddPrimaryKey(
                name: "PK_PhysicalAllocation",
                table: "PhysicalAllocation",
                column: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_Components_PhysicalAllocation_DefaultPhysicalAllocationId",
                table: "Components",
                column: "DefaultPhysicalAllocationId",
                principalTable: "PhysicalAllocation",
                principalColumn: "Id",
                onDelete: ReferentialAction.SetNull);

            migrationBuilder.AddForeignKey(
                name: "FK_HistoricValues_PhysicalAllocation_PhysicalAllocationId",
                table: "HistoricValues",
                column: "PhysicalAllocationId",
                principalTable: "PhysicalAllocation",
                principalColumn: "Id",
                onDelete: ReferentialAction.SetNull);
        }
    }
}
