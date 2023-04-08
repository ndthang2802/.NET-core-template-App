using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace StartFromScratch.Migrations
{
    /// <inheritdoc />
    public partial class UpdateProductTB : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "Category",
                table: "Products",
                type: "TEXT",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "ImagesName",
                table: "Products",
                type: "TEXT",
                nullable: true);

            migrationBuilder.AddColumn<float>(
                name: "discount",
                table: "Products",
                type: "REAL",
                nullable: false,
                defaultValue: 0f);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Category",
                table: "Products");

            migrationBuilder.DropColumn(
                name: "ImagesName",
                table: "Products");

            migrationBuilder.DropColumn(
                name: "discount",
                table: "Products");
        }
    }
}
