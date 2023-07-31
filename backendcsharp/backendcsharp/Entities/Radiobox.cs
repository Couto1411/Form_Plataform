using System;
using System.Collections.Generic;

namespace backendcsharp.Entities;

public partial class Radiobox
{
    public uint Id { get; set; }

    public uint QuestaoId { get; set; } 

    public uint RespostaId { get; set; } 

    public int? Radio { get; set; }

    public virtual Questoes Questao { get; set; } = null!;

    public virtual Destinatario Resposta { get; set; } = null!;
}
