using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace FinanceTracker.Core.Migrations
{
    /// <inheritdoc />
    public partial class AddLedgerEntry : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Ledger",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "TEXT", nullable: false),
                    Date = table.Column<DateOnly>(type: "TEXT", nullable: false),
                    TransactionId = table.Column<Guid>(type: "TEXT", nullable: false),
                    ComponentId = table.Column<Guid>(type: "TEXT", nullable: false),
                    PhysicalAllocationId = table.Column<Guid>(type: "TEXT", nullable: true),
                    Value_Amount = table.Column<decimal>(type: "TEXT", nullable: false),
                    Value_AmountInMainCurrency = table.Column<decimal>(type: "TEXT", nullable: false),
                    Value_Currency = table.Column<string>(type: "TEXT", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Ledger", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Ledger_Components_ComponentId",
                        column: x => x.ComponentId,
                        principalTable: "Components",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_Ledger_PhysicalAllocations_PhysicalAllocationId",
                        column: x => x.PhysicalAllocationId,
                        principalTable: "PhysicalAllocations",
                        principalColumn: "Id");
                });

            migrationBuilder.CreateIndex(
                name: "IX_Ledger_ComponentId",
                table: "Ledger",
                column: "ComponentId");

            migrationBuilder.CreateIndex(
                name: "IX_Ledger_PhysicalAllocationId",
                table: "Ledger",
                column: "PhysicalAllocationId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Ledger");
        }
    }
}
