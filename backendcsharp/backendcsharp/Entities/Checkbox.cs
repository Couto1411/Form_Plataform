using System;
using System.Collections.Generic;

namespace backendcsharp.Entities;

public partial class Checkbox
{
    public uint Id { get; set; }

    public uint QuestaoId { get; set; }

    public uint RespostaId { get; set; }

    public bool? Opcao1 { get; set; }

    public bool? Opcao2 { get; set; }

    public bool? Opcao3 { get; set; }

    public bool? Opcao4 { get; set; }

    public bool? Opcao5 { get; set; }

    public bool? Opcao6 { get; set; }

    public bool? Opcao7 { get; set; }

    public bool? Opcao8 { get; set; }

    public bool? Opcao9 { get; set; }

    public bool? Opcao10 { get; set; }

    public virtual Questoes Questao { get; set; } = null!;

    public virtual Destinatario Resposta { get; set; } = null!;
}
