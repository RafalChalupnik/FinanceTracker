using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace FinanceTracker.Core.Migrations
{
    /// <inheritdoc />
    public partial class AddedPhysicalAllocation : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<Guid>(
                name: "PhysicalAllocationId",
                table: "HistoricValues",
                type: "TEXT",
                nullable: true);

            migrationBuilder.CreateTable(
                name: "PhysicalAllocation",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "TEXT", nullable: false),
                    Name = table.Column<string>(type: "TEXT", nullable: false),
                    DisplaySequence = table.Column<int>(type: "INTEGER", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_PhysicalAllocation", x => x.Id);
                });

            migrationBuilder.CreateIndex(
                name: "IX_HistoricValues_PhysicalAllocationId",
                table: "HistoricValues",
                column: "PhysicalAllocationId");

            migrationBuilder.CreateIndex(
                name: "IX_PhysicalAllocation_Name",
                table: "PhysicalAllocation",
                column: "Name",
                unique: true);

            migrationBuilder.AddForeignKey(
                name: "FK_HistoricValues_PhysicalAllocation_PhysicalAllocationId",
                table: "HistoricValues",
                column: "PhysicalAllocationId",
                principalTable: "PhysicalAllocation",
                principalColumn: "Id",
                onDelete: ReferentialAction.SetNull);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_HistoricValues_PhysicalAllocation_PhysicalAllocationId",
                table: "HistoricValues");

            migrationBuilder.DropTable(
                name: "PhysicalAllocation");

            migrationBuilder.DropIndex(
                name: "IX_HistoricValues_PhysicalAllocationId",
                table: "HistoricValues");

            migrationBuilder.DropColumn(
                name: "PhysicalAllocationId",
                table: "HistoricValues");
        }
    }
}
