using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace FinanceTracker.Core.Migrations
{
    /// <inheritdoc />
    public partial class AddShowTargetsToGroup : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<bool>(
                name: "ShowTargets",
                table: "Groups",
                type: "INTEGER",
                nullable: false,
                defaultValue: false);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "ShowTargets",
                table: "Groups");
        }
    }
}
