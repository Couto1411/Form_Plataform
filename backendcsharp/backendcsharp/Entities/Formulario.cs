using System;
using System.Collections.Generic;

namespace backendcsharp.Entities;

public partial class Formulario
{
    public uint Id { get; set; }

    public string Titulo { get; set; } = null!;

    public uint? ResponsavelId { get; set; }

    public virtual ICollection<Enviado> Enviados { get; } = new List<Enviado>();

    public virtual ICollection<Questoes> Questoes { get; } = new List<Questoes>();

    public virtual Users? Responsavel { get; set; }
}
