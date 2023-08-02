namespace backendcsharp.DTO;

public partial class CheckboxDTO
{
    public uint? Id { get; set; } = null!;

    public uint? QuestaoId { get; set; } = null!;

    public uint? RespostaId { get; set; } = null!;

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

    public virtual QuestoesDTO Questao { get; set; } = null!;

    public virtual DestinatarioDTO Resposta { get; set; } = null!;
}
