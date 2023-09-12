using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace backendcsharp.Migrations
{
    public partial class Migration2 : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<string>(
                name: "texto",
                table: "text",
                type: "longtext",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "varchar(255)",
                oldMaxLength: 255,
                oldNullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "opcao9",
                table: "questoes",
                type: "mediumtext",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "varchar(255)",
                oldMaxLength: 255,
                oldNullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "opcao8",
                table: "questoes",
                type: "mediumtext",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "varchar(255)",
                oldMaxLength: 255,
                oldNullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "opcao7",
                table: "questoes",
                type: "mediumtext",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "varchar(255)",
                oldMaxLength: 255,
                oldNullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "opcao6",
                table: "questoes",
                type: "mediumtext",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "varchar(255)",
                oldMaxLength: 255,
                oldNullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "opcao5",
                table: "questoes",
                type: "mediumtext",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "varchar(255)",
                oldMaxLength: 255,
                oldNullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "opcao4",
                table: "questoes",
                type: "mediumtext",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "varchar(255)",
                oldMaxLength: 255,
                oldNullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "opcao3",
                table: "questoes",
                type: "mediumtext",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "varchar(255)",
                oldMaxLength: 255,
                oldNullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "opcao2",
                table: "questoes",
                type: "mediumtext",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "varchar(255)",
                oldMaxLength: 255,
                oldNullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "opcao10",
                table: "questoes",
                type: "mediumtext",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "varchar(255)",
                oldMaxLength: 255,
                oldNullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "opcao1",
                table: "questoes",
                type: "mediumtext",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "varchar(255)",
                oldMaxLength: 255,
                oldNullable: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<string>(
                name: "texto",
                table: "text",
                type: "varchar(255)",
                maxLength: 255,
                nullable: true,
                oldClrType: typeof(string),
                oldType: "longtext",
                oldNullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "opcao9",
                table: "questoes",
                type: "varchar(255)",
                maxLength: 255,
                nullable: true,
                oldClrType: typeof(string),
                oldType: "mediumtext",
                oldNullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "opcao8",
                table: "questoes",
                type: "varchar(255)",
                maxLength: 255,
                nullable: true,
                oldClrType: typeof(string),
                oldType: "mediumtext",
                oldNullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "opcao7",
                table: "questoes",
                type: "varchar(255)",
                maxLength: 255,
                nullable: true,
                oldClrType: typeof(string),
                oldType: "mediumtext",
                oldNullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "opcao6",
                table: "questoes",
                type: "varchar(255)",
                maxLength: 255,
                nullable: true,
                oldClrType: typeof(string),
                oldType: "mediumtext",
                oldNullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "opcao5",
                table: "questoes",
                type: "varchar(255)",
                maxLength: 255,
                nullable: true,
                oldClrType: typeof(string),
                oldType: "mediumtext",
                oldNullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "opcao4",
                table: "questoes",
                type: "varchar(255)",
                maxLength: 255,
                nullable: true,
                oldClrType: typeof(string),
                oldType: "mediumtext",
                oldNullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "opcao3",
                table: "questoes",
                type: "varchar(255)",
                maxLength: 255,
                nullable: true,
                oldClrType: typeof(string),
                oldType: "mediumtext",
                oldNullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "opcao2",
                table: "questoes",
                type: "varchar(255)",
                maxLength: 255,
                nullable: true,
                oldClrType: typeof(string),
                oldType: "mediumtext",
                oldNullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "opcao10",
                table: "questoes",
                type: "varchar(255)",
                maxLength: 255,
                nullable: true,
                oldClrType: typeof(string),
                oldType: "mediumtext",
                oldNullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "opcao1",
                table: "questoes",
                type: "varchar(255)",
                maxLength: 255,
                nullable: true,
                oldClrType: typeof(string),
                oldType: "mediumtext",
                oldNullable: true);
        }
    }
}
