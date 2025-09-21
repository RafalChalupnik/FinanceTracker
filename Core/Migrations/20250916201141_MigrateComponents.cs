using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace FinanceTracker.Core.Migrations
{
    /// <inheritdoc />
    public partial class MigrateComponents : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Components_Groups_GroupId",
                table: "Components");

            migrationBuilder.AlterColumn<Guid>(
                name: "GroupId",
                table: "Components",
                type: "TEXT",
                nullable: false,
                defaultValue: new Guid("00000000-0000-0000-0000-000000000000"),
                oldClrType: typeof(Guid),
                oldType: "TEXT",
                oldNullable: true);

            migrationBuilder.AddForeignKey(
                name: "FK_Components_Groups_GroupId",
                table: "Components",
                column: "GroupId",
                principalTable: "Groups",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
            
            migrationBuilder.Sql($@"
                update Components
                set GroupId = WalletId
            ");
            
            migrationBuilder.Sql($@"
                insert into Components (Id, Name, DisplaySequence, GroupId)
                select Id, Name, DisplaySequence, (select Id from Groups where Name = 'Assets') from Assets;
            ");
            
            migrationBuilder.Sql($@"
                insert into Components (Id, Name, DisplaySequence, GroupId)
                select Id, Name, DisplaySequence, (select Id from Groups where Name = 'Debts') from Debts;
            ");
            
            migrationBuilder.Sql($@"
                update HistoricValues
                set ComponentId = AssetId
                where AssetId is not null;
            ");
            
            migrationBuilder.Sql($@"
                update HistoricValues
                set ComponentId = DebtId
                where DebtId is not null;
            ");
            
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Components_Groups_GroupId",
                table: "Components");

            migrationBuilder.AlterColumn<Guid>(
                name: "GroupId",
                table: "Components",
                type: "TEXT",
                nullable: true,
                oldClrType: typeof(Guid),
                oldType: "TEXT");

            migrationBuilder.AddForeignKey(
                name: "FK_Components_Groups_GroupId",
                table: "Components",
                column: "GroupId",
                principalTable: "Groups",
                principalColumn: "Id");
        }
    }
}
