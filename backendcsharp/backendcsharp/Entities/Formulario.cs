using System;
using System.Collections.Generic;

namespace backendcsharp.Entities;

public partial class Formulario
{
    public uint Id { get; set; }

    public string Titulo { get; set; } = null!;

    public uint? ResponsavelId { get; set; }
    public uint? DerivadoDeId { get; set; } = null!;
    public DateTime? DataEnviado { get; set; } = null!;
    public string? MsgEmail { get; set; } = null!;

    public virtual ICollection<Formulario> Derivados { get; } = new List<Formulario>();

    public virtual ICollection<Destinatario> Enviados { get; } = new List<Destinatario>();

    public virtual ICollection<Questoes> Questoes { get; } = new List<Questoes>();

    public virtual Formulario? FormularioOrig { get; set; }

    public virtual Users? Responsavel { get; set; }
}
