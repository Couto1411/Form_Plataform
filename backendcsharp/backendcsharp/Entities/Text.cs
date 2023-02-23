using System;
using System.Collections.Generic;

namespace backendcsharp.Entities;

public partial class Text
{
    public uint Id { get; set; }

    public uint QuestaoId { get; set; }

    public uint RespostaId { get; set; }

    public string? Texto { get; set; }

    public virtual Questoes Questao { get; set; } = null!;

    public virtual Enviado Resposta { get; set; } = null!;
}
