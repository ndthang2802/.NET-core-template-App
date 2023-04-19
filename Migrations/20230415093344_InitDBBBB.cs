using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace StartFromScratch.Migrations
{
    /// <inheritdoc />
    public partial class InitDBBBB : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
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

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.UpdateData(
                table: "Roles",
                keyColumn: "Id",
                keyValue: 1,
                columns: new[] { "Created", "LastModified" },
                values: new object[] { new DateTime(2023, 4, 15, 16, 15, 28, 364, DateTimeKind.Local).AddTicks(5633), new DateTime(2023, 4, 15, 16, 15, 28, 364, DateTimeKind.Local).AddTicks(5637) });

            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "Id",
                keyValue: 1,
                columns: new[] { "Created", "LastModified", "PasswordHash" },
                values: new object[] { new DateTime(2023, 4, 15, 16, 15, 28, 364, DateTimeKind.Local).AddTicks(3853), new DateTime(2023, 4, 15, 16, 15, 28, 364, DateTimeKind.Local).AddTicks(3868), "$2a$11$PoTKXeUkSMsi2qyA5fKAKOnoL6w978t6iHH18wsuM2khT6AGFyRUG" });
        }
    }
}
