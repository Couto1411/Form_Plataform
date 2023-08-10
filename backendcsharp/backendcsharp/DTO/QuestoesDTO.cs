using backendcsharp.Entities;

namespace backendcsharp.DTO;

public partial class QuestoesDTO
{
    public uint? Id { get; set; } = null!;

    public uint Numero { get; set; }

    public int Type { get; set; }

    public uint? FormId { get; set; } = null!;

    public string? Enunciado { get; set; } = null!;
    public short? Obrigatoria { get; set; } = null!;

    public string? Opcao1 { get; set; } = null!;

    public string? Opcao2 { get; set; } = null!;

    public string? Opcao3 { get; set; } = null!;

    public string? Opcao4 { get; set; } = null!;

    public string? Opcao5 { get; set; } = null!;

    public string? Opcao6 { get; set; } = null!;

    public string? Opcao7 { get; set; } = null!;

    public string? Opcao8 { get; set; } = null!;

    public string? Opcao9 { get; set; } = null!;

    public string? Opcao10 { get; set; } = null!;
    public uint? DerivadaDeId { get; set; } = null!;
    public uint? DerivadaDeOpcao { get; set; } = null!;
    public virtual ICollection<QuestoesDTO> Derivadas { get; set; } = new List<QuestoesDTO>();

    public virtual ICollection<CheckboxDTO> Checkboxes { get; } = new List<CheckboxDTO>();

    public virtual FormularioDTO? Form { get; set; } = null!;

    public virtual ICollection<RadioboxDTO> Radioboxes { get; } = new List<RadioboxDTO>();

    public virtual ICollection<TextDTO> Texts { get; } = new List<TextDTO>();
    public virtual QuestoesDTO? QuestaoOrig { get; set; }

    public QuestoesDTO() { }
    public QuestoesDTO(Questoes questoes)
    {
        Id  = questoes.Id;
        Numero = questoes.Numero;
        Type = questoes.Type;
        FormId = questoes.FormId;
        Enunciado = questoes.Enunciado;
        Opcao1 = questoes.Opcao1;
        Opcao2 = questoes.Opcao2;
        Opcao3 = questoes.Opcao3;
        Opcao4 = questoes.Opcao4;
        Opcao5 = questoes.Opcao5;
        Opcao6 = questoes.Opcao6;
        Opcao7 = questoes.Opcao7;
        Opcao8 = questoes.Opcao8;
        Opcao9 = questoes.Opcao9;
        Opcao10 = questoes.Opcao10;
        DerivadaDeId = questoes.DerivadaDeId;
        DerivadaDeOpcao = questoes.DerivadaDeOpcao;
}
}
