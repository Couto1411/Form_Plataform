using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;
using backendcsharp.DTO;

namespace backendcsharp.Entities;

public partial class ProjetoDbContext : DbContext
{
    public ProjetoDbContext()
    {
    }

    public ProjetoDbContext(DbContextOptions<ProjetoDbContext> options)
        : base(options)
    {
    }

    public virtual DbSet<Checkbox> Checkboxes { get; set; }
    public virtual DbSet<Cursos> Cursos { get; set; }

    public virtual DbSet<Enviado> Enviados { get; set; }

    public virtual DbSet<Formulario> Formularios { get; set; }

    public virtual DbSet<Questoes> Questoes { get; set; }

    public virtual DbSet<Radiobox> Radioboxes { get; set; }

    public virtual DbSet<Text> Texts { get; set; }
    public virtual DbSet<TiposCursos> TiposCursos { get; set; }

    public virtual DbSet<Users> Users { get; set; }

    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder) { }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Checkbox>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PRIMARY");

            entity.ToTable("checkbox");

            entity.HasIndex(e => e.QuestaoId, "checkbox_questaoid_foreign");

            entity.HasIndex(e => e.RespostaId, "checkbox_respostaid_foreign");

            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.Opcao1).HasColumnName("opcao1");
            entity.Property(e => e.Opcao10).HasColumnName("opcao10");
            entity.Property(e => e.Opcao2).HasColumnName("opcao2");
            entity.Property(e => e.Opcao3).HasColumnName("opcao3");
            entity.Property(e => e.Opcao4).HasColumnName("opcao4");
            entity.Property(e => e.Opcao5).HasColumnName("opcao5");
            entity.Property(e => e.Opcao6).HasColumnName("opcao6");
            entity.Property(e => e.Opcao7).HasColumnName("opcao7");
            entity.Property(e => e.Opcao8).HasColumnName("opcao8");
            entity.Property(e => e.Opcao9).HasColumnName("opcao9");
            entity.Property(e => e.QuestaoId).HasColumnName("questaoId");
            entity.Property(e => e.RespostaId).HasColumnName("respostaId");

            entity.HasOne(d => d.Questao).WithMany(p => p.Checkboxes)
                .HasForeignKey(d => d.QuestaoId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("checkbox_questaoid_foreign");

            entity.HasOne(d => d.Resposta).WithMany(p => p.Checkboxes)
                .HasForeignKey(d => d.RespostaId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("checkbox_respostaid_foreign");
        });

        modelBuilder.Entity<Cursos>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PRIMARY");

            entity.ToTable("cursos");

            entity.HasIndex(e => e.ResponsavelId, "cursos_responsavelid_foreign");

            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.ResponsavelId).HasColumnName("responsavelId");
            entity.Property(e => e.Curso)
                .HasMaxLength(255)
                .HasColumnName("curso");

            entity.HasOne(d => d.Responsavel).WithMany(p => p.Cursos)
                .HasForeignKey(d => d.ResponsavelId)
                .HasConstraintName("cursos_responsavelid_foreign");
        });

        modelBuilder.Entity<Enviado>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PRIMARY");

            entity.ToTable("enviados");

            entity.HasIndex(e => e.FormId, "enviados_formid_foreign");
            entity.HasIndex(e => new { e.Email,e.FormId,e.Matricula}, "email_UNIQUE").IsUnique();

            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.Nome)
                .HasMaxLength(255)
                .HasColumnName("nome");
            entity.Property(e => e.Email)
                .HasMaxLength(255)
                .HasColumnName("email");
            entity.Property(e => e.Telefone1)
                .HasMaxLength(255)
                .HasColumnName("telefone1");
            entity.Property(e => e.Telefone2)
                .HasMaxLength(255)
                .HasColumnName("telefone2");
            entity.Property(e => e.Matricula)
                .HasMaxLength(255)
                .HasColumnName("matricula");
            entity.Property(e => e.Cpf)
                .HasMaxLength(255)
                .HasColumnName("cpf");
            entity.Property(e => e.Sexo)
                .HasMaxLength(1)
                .HasColumnName("sexo");
            entity.Property(e => e.Curso)
                .HasMaxLength(255)
                .HasColumnName("curso");
            entity.Property(e => e.TipoDeCurso)
                .HasMaxLength(1)
                .HasColumnName("tipodecurso");
            entity.Property(e => e.DataColacao).HasColumnName("datacolacao");
            entity.Property(e => e.FormId).HasColumnName("formId");
            entity.Property(e => e.Respondido).HasColumnName("respondido");

            entity.HasOne(d => d.Form).WithMany(p => p.Enviados)
                .HasForeignKey(d => d.FormId)
                .HasConstraintName("enviados_formid_foreign");
        });

        modelBuilder.Entity<Formulario>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PRIMARY");

            entity.ToTable("formularios");

            entity.HasIndex(e => e.ResponsavelId, "formularios_responsavelid_foreign");
            entity.HasIndex(e => e.DerivadoDeId, "formularios_derivadodeid_foreign");

            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.ResponsavelId).HasColumnName("responsavelId");
            entity.Property(e => e.Titulo)
                .HasMaxLength(255)
                .HasColumnName("titulo");
            entity.Property(e => e.DataEnviado).HasColumnName("dataEnviado");

            entity.HasOne(d => d.Responsavel).WithMany(p => p.Formularios)
                .HasForeignKey(d => d.ResponsavelId)
                .HasConstraintName("formularios_responsavelid_foreign");

            entity.HasOne(d => d.FormularioOrig).WithMany(p => p.Derivados)
                .HasForeignKey(d => d.DerivadoDeId)
                .HasConstraintName("formularios_derivadodeid_foreign");
        });

        modelBuilder.Entity<Questoes>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PRIMARY");

            entity.ToTable("questoes");

            entity.HasIndex(e => e.FormId, "questoes_formid_foreign");
            entity.HasIndex(e => e.DerivadaDeId, "questoes_derivadodeid_foreign");

            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.Enunciado)
                .HasColumnType("longtext")
                .HasColumnName("enunciado");
            entity.Property(e => e.FormId).HasColumnName("formId");
            entity.Property(e => e.DerivadaDeOpcao).HasColumnName("derivadaDeOpcao");
            entity.Property(e => e.Numero).HasColumnName("numero");
            entity.Property(e => e.Opcao1)
                .HasMaxLength(255)
                .HasColumnName("opcao1");
            entity.Property(e => e.Opcao10)
                .HasMaxLength(255)
                .HasColumnName("opcao10");
            entity.Property(e => e.Opcao2)
                .HasMaxLength(255)
                .HasColumnName("opcao2");
            entity.Property(e => e.Opcao3)
                .HasMaxLength(255)
                .HasColumnName("opcao3");
            entity.Property(e => e.Opcao4)
                .HasMaxLength(255)
                .HasColumnName("opcao4");
            entity.Property(e => e.Opcao5)
                .HasMaxLength(255)
                .HasColumnName("opcao5");
            entity.Property(e => e.Opcao6)
                .HasMaxLength(255)
                .HasColumnName("opcao6");
            entity.Property(e => e.Opcao7)
                .HasMaxLength(255)
                .HasColumnName("opcao7");
            entity.Property(e => e.Opcao8)
                .HasMaxLength(255)
                .HasColumnName("opcao8");
            entity.Property(e => e.Opcao9)
                .HasMaxLength(255)
                .HasColumnName("opcao9");
            entity.Property(e => e.Type).HasColumnName("type");

            entity.HasOne(d => d.Form).WithMany(p => p.Questoes)
                .HasForeignKey(d => d.FormId)
                .HasConstraintName("questoes_formid_foreign");

            entity.HasOne(d => d.QuestaoOrig).WithMany(p => p.Derivadas)
                .HasForeignKey(d => d.DerivadaDeId)
                .HasConstraintName("questoes_derivadodeid_foreign");
        });

        modelBuilder.Entity<Radiobox>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PRIMARY");

            entity.ToTable("radiobox");

            entity.HasIndex(e => e.QuestaoId, "radiobox_questaoid_foreign");

            entity.HasIndex(e => e.RespostaId, "radiobox_respostaid_foreign");

            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.QuestaoId).HasColumnName("questaoId");
            entity.Property(e => e.Radio).HasColumnName("radio");
            entity.Property(e => e.RespostaId).HasColumnName("respostaId");

            entity.HasOne(d => d.Questao).WithMany(p => p.Radioboxes)
                .HasForeignKey(d => d.QuestaoId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("radiobox_questaoid_foreign");

            entity.HasOne(d => d.Resposta).WithMany(p => p.Radioboxes)
                .HasForeignKey(d => d.RespostaId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("radiobox_respostaid_foreign");
        });

        modelBuilder.Entity<Text>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PRIMARY");

            entity.ToTable("text");

            entity.HasIndex(e => e.QuestaoId, "text_questaoid_foreign");

            entity.HasIndex(e => e.RespostaId, "text_respostaid_foreign");

            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.QuestaoId).HasColumnName("questaoId");
            entity.Property(e => e.RespostaId).HasColumnName("respostaId");
            entity.Property(e => e.Texto)
                .HasMaxLength(255)
                .HasColumnName("texto");

            entity.HasOne(d => d.Questao).WithMany(p => p.Texts)
                .HasForeignKey(d => d.QuestaoId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("text_questaoid_foreign");

            entity.HasOne(d => d.Resposta).WithMany(p => p.Texts)
                .HasForeignKey(d => d.RespostaId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("text_respostaid_foreign");
        });

        modelBuilder.Entity<TiposCursos>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PRIMARY");

            entity.ToTable("tipos_cursos");

            entity.HasIndex(e => e.ResponsavelId, "tipocursos_responsavelid_foreign");

            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.ResponsavelId).HasColumnName("responsavelId");
            entity.Property(e => e.TipoCurso)
                .HasMaxLength(255)
                .HasColumnName("tipo_curso");

            entity.HasOne(d => d.Responsavel).WithMany(p => p.TiposCursos)
                .HasForeignKey(d => d.ResponsavelId)
                .HasConstraintName("tipocursos_responsavelid_foreign");
        });

        modelBuilder.Entity<Users>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PRIMARY");

            entity.ToTable("users");

            entity.HasIndex(e => e.Email, "users_email_unique").IsUnique();

            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.Admin).HasColumnName("admin");
            entity.Property(e => e.AppPassword)
                .HasMaxLength(255)
                .HasColumnName("apppassword");
            entity.Property(e => e.Email).HasColumnName("email");
            entity.Property(e => e.Nome)
                .HasMaxLength(255)
                .HasColumnName("nome");
            entity.Property(e => e.Senha)
                .HasMaxLength(255)
                .HasColumnName("senha");
            entity.Property(e => e.Universidade)
                .HasMaxLength(255)
                .HasColumnName("universidade");
        });

        OnModelCreatingPartial(modelBuilder);
    }

    partial void OnModelCreatingPartial(ModelBuilder modelBuilder);

    public DbSet<backendcsharp.DTO.UsersDTO> UsersDTO { get; set; }
}
