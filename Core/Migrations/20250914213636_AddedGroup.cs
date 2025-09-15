using System;
using FinanceTracker.Core.Entities;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace FinanceTracker.Core.Migrations
{
    /// <inheritdoc />
    public partial class AddedGroup : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Groups",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "TEXT", nullable: false),
                    Name = table.Column<string>(type: "TEXT", nullable: false),
                    DisplaySequence = table.Column<int>(type: "INTEGER", nullable: false),
                    GroupTypeId = table.Column<Guid>(type: "TEXT", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Groups", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Groups_GroupTypes_GroupTypeId",
                        column: x => x.GroupTypeId,
                        principalTable: "GroupTypes",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Groups_GroupTypeId",
                table: "Groups",
                column: "GroupTypeId");

            migrationBuilder.CreateIndex(
                name: "IX_Groups_Name",
                table: "Groups",
                column: "Name",
                unique: true);
            
            InsertGroup(migrationBuilder, "Assets", 1);
            InsertGroup(migrationBuilder, "Debts", 2);

            migrationBuilder.Sql($@"
                insert into Groups (Id, Name, DisplaySequence, GroupTypeId)
                select Id, Name, DisplaySequence, (select Id from GroupTypes where Name = 'Wallets') from Wallets;
            ");
            
            // TODO: Require "GroupTypeId" value in dropdown in Configuration
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Groups");
        }

        private static void InsertGroup(MigrationBuilder migrationBuilder, string name, int displaySequence) =>
            migrationBuilder.Sql($@"
                insert into Groups (Id, Name, DisplaySequence, GroupTypeId)
                values (
                    '{Guid.NewGuid().ToString()}', 
                    '{name}', 
                    {displaySequence}, 
                    (select Id from GroupTypes where Name = '{name}')
                );
            ");
    }
}
