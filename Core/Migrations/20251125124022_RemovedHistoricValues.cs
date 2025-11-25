using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace FinanceTracker.Core.Migrations
{
    /// <inheritdoc />
    public partial class RemovedHistoricValues : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Ledger_PhysicalAllocations_PhysicalAllocationId",
                table: "Ledger");

            migrationBuilder.DropTable(
                name: "HistoricValues");

            migrationBuilder.AddForeignKey(
                name: "FK_Ledger_PhysicalAllocations_PhysicalAllocationId",
                table: "Ledger",
                column: "PhysicalAllocationId",
                principalTable: "PhysicalAllocations",
                principalColumn: "Id",
                onDelete: ReferentialAction.SetNull);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Ledger_PhysicalAllocations_PhysicalAllocationId",
                table: "Ledger");

            migrationBuilder.CreateTable(
                name: "HistoricValues",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "TEXT", nullable: false),
                    ComponentId = table.Column<Guid>(type: "TEXT", nullable: true),
                    Date = table.Column<DateOnly>(type: "TEXT", nullable: false),
                    PhysicalAllocationId = table.Column<Guid>(type: "TEXT", nullable: true),
                    Value_Amount = table.Column<decimal>(type: "TEXT", nullable: false),
                    Value_AmountInMainCurrency = table.Column<decimal>(type: "TEXT", nullable: false),
                    Value_Currency = table.Column<string>(type: "TEXT", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_HistoricValues", x => x.Id);
                    table.ForeignKey(
                        name: "FK_HistoricValues_Components_ComponentId",
                        column: x => x.ComponentId,
                        principalTable: "Components",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_HistoricValues_PhysicalAllocations_PhysicalAllocationId",
                        column: x => x.PhysicalAllocationId,
                        principalTable: "PhysicalAllocations",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.SetNull);
                });

            migrationBuilder.CreateIndex(
                name: "IX_HistoricValues_ComponentId",
                table: "HistoricValues",
                column: "ComponentId");

            migrationBuilder.CreateIndex(
                name: "IX_HistoricValues_PhysicalAllocationId",
                table: "HistoricValues",
                column: "PhysicalAllocationId");

            migrationBuilder.AddForeignKey(
                name: "FK_Ledger_PhysicalAllocations_PhysicalAllocationId",
                table: "Ledger",
                column: "PhysicalAllocationId",
                principalTable: "PhysicalAllocations",
                principalColumn: "Id");
        }
    }
}
