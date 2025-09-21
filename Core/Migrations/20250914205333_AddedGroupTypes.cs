using System;
using FinanceTracker.Core.Entities;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace FinanceTracker.Core.Migrations
{
    /// <inheritdoc />
    public partial class AddedGroupTypes : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "GroupTypes",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "TEXT", nullable: false),
                    Name = table.Column<string>(type: "TEXT", nullable: false),
                    DisplaySequence = table.Column<int>(type: "INTEGER", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_GroupTypes", x => x.Id);
                });

            migrationBuilder.CreateIndex(
                name: "IX_GroupTypes_Name",
                table: "GroupTypes",
                column: "Name",
                unique: true);
            
            InsertGroupType(migrationBuilder, "Assets", 1);
            InsertGroupType(migrationBuilder, "Debts", 2);
            InsertGroupType(migrationBuilder, "Wallets", 3);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "GroupTypes");
        }

        private static void InsertGroupType(MigrationBuilder migrationBuilder, string name, int displaySequence) =>
            migrationBuilder.InsertData(
                table: "GroupTypes", 
                columns: [
                    nameof(GroupType.Id), 
                    nameof(GroupType.Name), 
                    nameof(GroupType.DisplaySequence)
                ], 
                values: new object[] { 
                    Guid.NewGuid(), 
                    name, 
                    displaySequence 
                }
            );
    }
}
