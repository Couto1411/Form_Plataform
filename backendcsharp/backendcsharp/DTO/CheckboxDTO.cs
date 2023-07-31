namespace backendcsharp.DTO;

public partial class CheckboxDTO
{
    public uint? id { get; set; } = null!;

    public uint? questaoId { get; set; } = null!;

    public uint? respostaId { get; set; } = null!;

    public bool? opcao1 { get; set; }

    public bool? opcao2 { get; set; }

    public bool? opcao3 { get; set; }

    public bool? opcao4 { get; set; }

    public bool? opcao5 { get; set; }

    public bool? opcao6 { get; set; }

    public bool? opcao7 { get; set; }

    public bool? opcao8 { get; set; }

    public bool? opcao9 { get; set; }

    public bool? opcao10 { get; set; }

    public virtual QuestoesDTO questao { get; set; } = null!;

    public virtual DestinatarioDTO resposta { get; set; } = null!;
}
