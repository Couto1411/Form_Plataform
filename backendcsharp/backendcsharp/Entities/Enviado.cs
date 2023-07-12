using System;
using System.Collections.Generic;

namespace backendcsharp.Entities;

public partial class Enviado
{
    public uint Id { get; set; }

    public uint? FormId { get; set; }

    public short Respondido { get; set; }
    public string? Nome { get; set; } = null!;
    public string? Email { get; set; } = null!;
    public string? Telefone1 { get; set; } = null!;
    public string? Telefone2 { get; set; } = null!;
    public string? Matricula { get; set; } = null!;
    public string? Cpf { get; set; } = null!;
    public string? Sexo { get; set; } = null!;
    public string? Curso { get; set; } = null!;
    public string? TipoDeCurso { get; set; } = null!;
    public DateTime? DataColacao { get; set; } = null!;

    public virtual ICollection<Checkbox> Checkboxes { get; } = new List<Checkbox>();

    public virtual Formulario? Form { get; set; }

    public virtual ICollection<Radiobox> Radioboxes { get; } = new List<Radiobox>();

    public virtual ICollection<Text> Texts { get; } = new List<Text>();
}
