using System;
using System.Collections.Generic;

namespace backendcsharp.Entities;

public partial class Questoes
{
    public uint Id { get; set; }

    public uint Numero { get; set; }

    public int Type { get; set; }

    public uint? FormId { get; set; }

    public string Enunciado { get; set; } = null!;

    public string? Opcao1 { get; set; }

    public string? Opcao2 { get; set; }

    public string? Opcao3 { get; set; }

    public string? Opcao4 { get; set; }

    public string? Opcao5 { get; set; }

    public string? Opcao6 { get; set; }

    public string? Opcao7 { get; set; }

    public string? Opcao8 { get; set; }

    public string? Opcao9 { get; set; }

    public string? Opcao10 { get; set; }

    public virtual ICollection<Checkbox> Checkboxes { get; } = new List<Checkbox>();

    public virtual Formulario? Form { get; set; }

    public virtual ICollection<Radiobox> Radioboxes { get; } = new List<Radiobox>();

    public virtual ICollection<Text> Texts { get; } = new List<Text>();
}
