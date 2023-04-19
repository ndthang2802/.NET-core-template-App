using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace StartFromScratch.Migrations
{
    /// <inheritdoc />
    public partial class editTableProduct : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.UpdateData(
                table: "Roles",
                keyColumn: "Id",
                keyValue: 1,
                columns: new[] { "Created", "LastModified" },
                values: new object[] { new DateTime(2023, 4, 16, 15, 25, 48, 893, DateTimeKind.Local).AddTicks(6254), new DateTime(2023, 4, 16, 15, 25, 48, 893, DateTimeKind.Local).AddTicks(6256) });

            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "Id",
                keyValue: 1,
                columns: new[] { "Created", "LastModified", "PasswordHash" },
                values: new object[] { new DateTime(2023, 4, 16, 15, 25, 48, 893, DateTimeKind.Local).AddTicks(5235), new DateTime(2023, 4, 16, 15, 25, 48, 893, DateTimeKind.Local).AddTicks(5249), "$2a$11$J8GJlSdahwT4SL1NSyTNzue/yVVpJtueM7/6vXGW/QH/Pv8Unar5O" });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.UpdateData(
                table: "Roles",
                keyColumn: "Id",
                keyValue: 1,
                columns: new[] { "Created", "LastModified" },
                values: new object[] { new DateTime(2023, 4, 15, 16, 33, 44, 244, DateTimeKind.Local).AddTicks(365), new DateTime(2023, 4, 15, 16, 33, 44, 244, DateTimeKind.Local).AddTicks(370) });

            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "Id",
                keyValue: 1,
                columns: new[] { "Created", "LastModified", "PasswordHash" },
                values: new object[] { new DateTime(2023, 4, 15, 16, 33, 44, 243, DateTimeKind.Local).AddTicks(8866), new DateTime(2023, 4, 15, 16, 33, 44, 243, DateTimeKind.Local).AddTicks(8880), "$2a$11$tVGw3eGMDo8Hy.uO.oO/xudjEsoFj8kvO/iMEhpP3C5N0I1fkoW9a" });
        }
    }
}
