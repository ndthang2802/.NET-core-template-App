using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace StartFromScratch.Migrations
{
    /// <inheritdoc />
    public partial class InitDBB : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.UpdateData(
                table: "Roles",
                keyColumn: "Id",
                keyValue: 1,
                columns: new[] { "Created", "LastModified" },
                values: new object[] { new DateTime(2023, 4, 15, 15, 55, 10, 908, DateTimeKind.Local).AddTicks(1992), new DateTime(2023, 4, 15, 15, 55, 10, 908, DateTimeKind.Local).AddTicks(1994) });

            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "Id",
                keyValue: 1,
                columns: new[] { "Created", "LastModified", "PasswordHash" },
                values: new object[] { new DateTime(2023, 4, 15, 15, 55, 10, 908, DateTimeKind.Local).AddTicks(534), new DateTime(2023, 4, 15, 15, 55, 10, 908, DateTimeKind.Local).AddTicks(551), "$2a$11$Xl1rdx20l.ssnj/WT0KcA.B7DnKpCMuU5P3/n/tHxMurIqzz5XoUm" });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.UpdateData(
                table: "Roles",
                keyColumn: "Id",
                keyValue: 1,
                columns: new[] { "Created", "LastModified" },
                values: new object[] { new DateTime(2023, 4, 15, 15, 44, 21, 785, DateTimeKind.Local).AddTicks(7175), new DateTime(2023, 4, 15, 15, 44, 21, 785, DateTimeKind.Local).AddTicks(7178) });

            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "Id",
                keyValue: 1,
                columns: new[] { "Created", "LastModified", "PasswordHash" },
                values: new object[] { new DateTime(2023, 4, 15, 15, 44, 21, 785, DateTimeKind.Local).AddTicks(5286), new DateTime(2023, 4, 15, 15, 44, 21, 785, DateTimeKind.Local).AddTicks(5303), "$2a$11$c6CeDKM7R2d3/NxEYAlYhuQh0OEkobvzizJVzMRvCv3rHLGkp0XIq" });
        }
    }
}
