using System;
using Microsoft.EntityFrameworkCore.Migrations;
using MySql.EntityFrameworkCore.Metadata;

#nullable disable

namespace backendcsharp.Migrations
{
    public partial class Migration1 : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterDatabase()
                .Annotation("MySQL:Charset", "utf8mb4");

            var values = GetParameters();

            migrationBuilder.CreateTable(
                name: "users",
                columns: table => new
                {
                    id = table.Column<uint>(type: "int unsigned", nullable: false)
                        .Annotation("MySQL:ValueGenerationStrategy", MySQLValueGenerationStrategy.IdentityColumn),
                    nome = table.Column<string>(type: "varchar(255)", maxLength: 255, nullable: false),
                    email = table.Column<string>(type: "varchar(255)", nullable: false),
                    senha = table.Column<string>(type: "varchar(255)", maxLength: 255, nullable: false),
                    universidade = table.Column<string>(type: "varchar(255)", maxLength: 255, nullable: false),
                    admin = table.Column<bool>(type: "tinyint(1)", nullable: false, defaultValue: false),
                    apppassword = table.Column<string>(type: "varchar(255)", maxLength: 255, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PRIMARY", x => x.id);
                })
                .Annotation("MySQL:Charset", "utf8mb4");

            migrationBuilder.InsertData(
                table: "users",
                columns: new[] { "nome", "email", "senha", "universidade", "admin", "apppassword" },
                values: new object[] { "admin", values.GetValue<string>("email"), BCrypt.Net.BCrypt.HashPassword(values.GetValue<string>("senha")), "", true, "" });

            migrationBuilder.CreateTable(
                name: "cursos",
                columns: table => new
                {
                    id = table.Column<uint>(type: "int unsigned", nullable: false)
                        .Annotation("MySQL:ValueGenerationStrategy", MySQLValueGenerationStrategy.IdentityColumn),
                    responsavelId = table.Column<uint>(type: "int unsigned", nullable: false),
                    curso = table.Column<string>(type: "varchar(255)", maxLength: 255, nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PRIMARY", x => x.id);
                    table.ForeignKey(
                        name: "cursos_responsavelid_foreign",
                        column: x => x.responsavelId,
                        principalTable: "users",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                })
                .Annotation("MySQL:Charset", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "formularios",
                columns: table => new
                {
                    id = table.Column<uint>(type: "int unsigned", nullable: false)
                        .Annotation("MySQL:ValueGenerationStrategy", MySQLValueGenerationStrategy.IdentityColumn),
                    titulo = table.Column<string>(type: "varchar(255)", maxLength: 255, nullable: false),
                    responsavelId = table.Column<uint>(type: "int unsigned", nullable: false),
                    DerivadoDeId = table.Column<uint>(type: "int unsigned", nullable: true),
                    dataEnviado = table.Column<DateTime>(type: "datetime(6)", nullable: true),
                    msgEmail = table.Column<string>(type: "longtext", nullable: true),
                    notificacao = table.Column<short>(type: "smallint", nullable: false, defaultValue: (short)0)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PRIMARY", x => x.id);
                    table.ForeignKey(
                        name: "formularios_derivadodeid_foreign",
                        column: x => x.DerivadoDeId,
                        principalTable: "formularios",
                        principalColumn: "id");
                    table.ForeignKey(
                        name: "formularios_responsavelid_foreign",
                        column: x => x.responsavelId,
                        principalTable: "users",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                })
                .Annotation("MySQL:Charset", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "tipos_cursos",
                columns: table => new
                {
                    id = table.Column<uint>(type: "int unsigned", nullable: false)
                        .Annotation("MySQL:ValueGenerationStrategy", MySQLValueGenerationStrategy.IdentityColumn),
                    responsavelId = table.Column<uint>(type: "int unsigned", nullable: false),
                    tipo_curso = table.Column<string>(type: "varchar(255)", maxLength: 255, nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PRIMARY", x => x.id);
                    table.ForeignKey(
                        name: "tipocursos_responsavelid_foreign",
                        column: x => x.responsavelId,
                        principalTable: "users",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                })
                .Annotation("MySQL:Charset", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "enviados",
                columns: table => new
                {
                    id = table.Column<uint>(type: "int unsigned", nullable: false)
                        .Annotation("MySQL:ValueGenerationStrategy", MySQLValueGenerationStrategy.IdentityColumn),
                    formId = table.Column<uint>(type: "int unsigned", nullable: false),
                    respondido = table.Column<short>(type: "smallint", nullable: false, defaultValue: (short)0),
                    nome = table.Column<string>(type: "varchar(255)", maxLength: 255, nullable: true),
                    email = table.Column<string>(type: "varchar(255)", maxLength: 255, nullable: true),
                    telefone1 = table.Column<string>(type: "varchar(255)", maxLength: 255, nullable: true),
                    telefone2 = table.Column<string>(type: "varchar(255)", maxLength: 255, nullable: true),
                    matricula = table.Column<string>(type: "varchar(255)", maxLength: 255, nullable: true),
                    cpf = table.Column<string>(type: "varchar(255)", maxLength: 255, nullable: true),
                    sexo = table.Column<string>(type: "varchar(1)", maxLength: 1, nullable: true),
                    curso = table.Column<string>(type: "varchar(255)", maxLength: 255, nullable: true),
                    tipodecurso = table.Column<string>(type: "varchar(1)", maxLength: 1, nullable: true),
                    datacolacao = table.Column<DateTime>(type: "datetime(6)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PRIMARY", x => x.id);
                    table.ForeignKey(
                        name: "enviados_formid_foreign",
                        column: x => x.formId,
                        principalTable: "formularios",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                })
                .Annotation("MySQL:Charset", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "questoes",
                columns: table => new
                {
                    id = table.Column<uint>(type: "int unsigned", nullable: false)
                        .Annotation("MySQL:ValueGenerationStrategy", MySQLValueGenerationStrategy.IdentityColumn),
                    numero = table.Column<uint>(type: "int unsigned", nullable: false),
                    type = table.Column<int>(type: "int", nullable: false),
                    formId = table.Column<uint>(type: "int unsigned", nullable: false),
                    enunciado = table.Column<string>(type: "longtext", nullable: false),
                    obrigatoria = table.Column<short>(type: "smallint", nullable: false, defaultValue: (short)1),
                    opcao1 = table.Column<string>(type: "varchar(255)", maxLength: 255, nullable: true),
                    opcao2 = table.Column<string>(type: "varchar(255)", maxLength: 255, nullable: true),
                    opcao3 = table.Column<string>(type: "varchar(255)", maxLength: 255, nullable: true),
                    opcao4 = table.Column<string>(type: "varchar(255)", maxLength: 255, nullable: true),
                    opcao5 = table.Column<string>(type: "varchar(255)", maxLength: 255, nullable: true),
                    opcao6 = table.Column<string>(type: "varchar(255)", maxLength: 255, nullable: true),
                    opcao7 = table.Column<string>(type: "varchar(255)", maxLength: 255, nullable: true),
                    opcao8 = table.Column<string>(type: "varchar(255)", maxLength: 255, nullable: true),
                    opcao9 = table.Column<string>(type: "varchar(255)", maxLength: 255, nullable: true),
                    opcao10 = table.Column<string>(type: "varchar(255)", maxLength: 255, nullable: true),
                    DerivadaDeId = table.Column<uint>(type: "int unsigned", nullable: true),
                    derivadaDeOpcao = table.Column<uint>(type: "int unsigned", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PRIMARY", x => x.id);
                    table.ForeignKey(
                        name: "questoes_derivadodeid_foreign",
                        column: x => x.DerivadaDeId,
                        principalTable: "questoes",
                        principalColumn: "id");
                    table.ForeignKey(
                        name: "questoes_formid_foreign",
                        column: x => x.formId,
                        principalTable: "formularios",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                })
                .Annotation("MySQL:Charset", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "checkbox",
                columns: table => new
                {
                    id = table.Column<uint>(type: "int unsigned", nullable: false)
                        .Annotation("MySQL:ValueGenerationStrategy", MySQLValueGenerationStrategy.IdentityColumn),
                    questaoId = table.Column<uint>(type: "int unsigned", nullable: false),
                    respostaId = table.Column<uint>(type: "int unsigned", nullable: false),
                    opcao1 = table.Column<bool>(type: "tinyint(1)", nullable: true),
                    opcao2 = table.Column<bool>(type: "tinyint(1)", nullable: true),
                    opcao3 = table.Column<bool>(type: "tinyint(1)", nullable: true),
                    opcao4 = table.Column<bool>(type: "tinyint(1)", nullable: true),
                    opcao5 = table.Column<bool>(type: "tinyint(1)", nullable: true),
                    opcao6 = table.Column<bool>(type: "tinyint(1)", nullable: true),
                    opcao7 = table.Column<bool>(type: "tinyint(1)", nullable: true),
                    opcao8 = table.Column<bool>(type: "tinyint(1)", nullable: true),
                    opcao9 = table.Column<bool>(type: "tinyint(1)", nullable: true),
                    opcao10 = table.Column<bool>(type: "tinyint(1)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PRIMARY", x => x.id);
                    table.ForeignKey(
                        name: "checkbox_questaoid_foreign",
                        column: x => x.questaoId,
                        principalTable: "questoes",
                        principalColumn: "id");
                    table.ForeignKey(
                        name: "checkbox_respostaid_foreign",
                        column: x => x.respostaId,
                        principalTable: "enviados",
                        principalColumn: "id");
                })
                .Annotation("MySQL:Charset", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "radiobox",
                columns: table => new
                {
                    id = table.Column<uint>(type: "int unsigned", nullable: false)
                        .Annotation("MySQL:ValueGenerationStrategy", MySQLValueGenerationStrategy.IdentityColumn),
                    questaoId = table.Column<uint>(type: "int unsigned", nullable: false),
                    respostaId = table.Column<uint>(type: "int unsigned", nullable: false),
                    radio = table.Column<int>(type: "int", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PRIMARY", x => x.id);
                    table.ForeignKey(
                        name: "radiobox_questaoid_foreign",
                        column: x => x.questaoId,
                        principalTable: "questoes",
                        principalColumn: "id");
                    table.ForeignKey(
                        name: "radiobox_respostaid_foreign",
                        column: x => x.respostaId,
                        principalTable: "enviados",
                        principalColumn: "id");
                })
                .Annotation("MySQL:Charset", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "text",
                columns: table => new
                {
                    id = table.Column<uint>(type: "int unsigned", nullable: false)
                        .Annotation("MySQL:ValueGenerationStrategy", MySQLValueGenerationStrategy.IdentityColumn),
                    questaoId = table.Column<uint>(type: "int unsigned", nullable: false),
                    respostaId = table.Column<uint>(type: "int unsigned", nullable: false),
                    texto = table.Column<string>(type: "varchar(255)", maxLength: 255, nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PRIMARY", x => x.id);
                    table.ForeignKey(
                        name: "text_questaoid_foreign",
                        column: x => x.questaoId,
                        principalTable: "questoes",
                        principalColumn: "id");
                    table.ForeignKey(
                        name: "text_respostaid_foreign",
                        column: x => x.respostaId,
                        principalTable: "enviados",
                        principalColumn: "id");
                })
                .Annotation("MySQL:Charset", "utf8mb4");

            migrationBuilder.CreateIndex(
                name: "checkbox_questaoid_foreign",
                table: "checkbox",
                column: "questaoId");

            migrationBuilder.CreateIndex(
                name: "checkbox_respostaid_foreign",
                table: "checkbox",
                column: "respostaId");

            migrationBuilder.CreateIndex(
                name: "cursos_responsavelid_foreign",
                table: "cursos",
                column: "responsavelId");

            migrationBuilder.CreateIndex(
                name: "email_UNIQUE",
                table: "enviados",
                columns: new[] { "email", "formId", "matricula" },
                unique: true);

            migrationBuilder.CreateIndex(
                name: "enviados_formid_foreign",
                table: "enviados",
                column: "formId");

            migrationBuilder.CreateIndex(
                name: "formularios_derivadodeid_foreign",
                table: "formularios",
                column: "DerivadoDeId");

            migrationBuilder.CreateIndex(
                name: "formularios_responsavelid_foreign",
                table: "formularios",
                column: "responsavelId");

            migrationBuilder.CreateIndex(
                name: "questoes_derivadodeid_foreign",
                table: "questoes",
                column: "DerivadaDeId");

            migrationBuilder.CreateIndex(
                name: "questoes_formid_foreign",
                table: "questoes",
                column: "formId");

            migrationBuilder.CreateIndex(
                name: "radiobox_questaoid_foreign",
                table: "radiobox",
                column: "questaoId");

            migrationBuilder.CreateIndex(
                name: "radiobox_respostaid_foreign",
                table: "radiobox",
                column: "respostaId");

            migrationBuilder.CreateIndex(
                name: "text_questaoid_foreign",
                table: "text",
                column: "questaoId");

            migrationBuilder.CreateIndex(
                name: "text_respostaid_foreign",
                table: "text",
                column: "respostaId");

            migrationBuilder.CreateIndex(
                name: "tipocursos_responsavelid_foreign",
                table: "tipos_cursos",
                column: "responsavelId");

            migrationBuilder.CreateIndex(
                name: "users_email_unique",
                table: "users",
                column: "email",
                unique: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "checkbox");

            migrationBuilder.DropTable(
                name: "cursos");

            migrationBuilder.DropTable(
                name: "radiobox");

            migrationBuilder.DropTable(
                name: "text");

            migrationBuilder.DropTable(
                name: "tipos_cursos");

            migrationBuilder.DropTable(
                name: "questoes");

            migrationBuilder.DropTable(
                name: "enviados");

            migrationBuilder.DropTable(
                name: "formularios");

            migrationBuilder.DropTable(
                name: "users");
        }

        private static IConfigurationSection GetParameters()
        {
            var builder = new ConfigurationBuilder()
                                .SetBasePath(AppContext.BaseDirectory)
                                .AddJsonFile("appsettings.json");

            var val = builder.Build().GetSection("AppAdminInfo");

            return val;
        }
    }
}
