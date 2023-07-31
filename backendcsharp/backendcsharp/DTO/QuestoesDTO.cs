using backendcsharp.Entities;

namespace backendcsharp.DTO;

public partial class QuestoesDTO
{
    public uint? id { get; set; } = null!;

    public uint numero { get; set; }

    public int type { get; set; }

    public uint? formId { get; set; } = null!;

    public string? enunciado { get; set; } = null!;

    public string? opcao1 { get; set; } = null!;

    public string? opcao2 { get; set; } = null!;

    public string? opcao3 { get; set; } = null!;

    public string? opcao4 { get; set; } = null!;

    public string? opcao5 { get; set; } = null!; 

    public string? opcao6 { get; set; } = null!;

    public string? opcao7 { get; set; } = null!;

    public string? opcao8 { get; set; } = null!;

    public string? opcao9 { get; set; } = null!;

    public string? opcao10 { get; set; } = null!;
    public uint? derivadaDeId { get; set; } = null!;
    public uint? derivadaDeOpcao { get; set; } = null!;
    public virtual ICollection<QuestoesDTO> derivadas { get; set; } = new List<QuestoesDTO>();

    public virtual ICollection<CheckboxDTO> checkboxes { get; } = new List<CheckboxDTO>();

    public virtual FormularioDTO? form { get; set; } = null!;

    public virtual ICollection<RadioboxDTO> radioboxes { get; } = new List<RadioboxDTO>();

    public virtual ICollection<TextDTO> texts { get; } = new List<TextDTO>();
    public virtual QuestoesDTO? questaoOrig { get; set; }

    public QuestoesDTO() { }
    public QuestoesDTO(Questoes questoes)
    {
        id  = questoes.Id;
        numero = questoes.Numero;
        type = questoes.Type;
        formId = questoes.FormId;
        enunciado = questoes.Enunciado;
        opcao1 = questoes.Opcao1;
        opcao2 = questoes.Opcao2;
        opcao3 = questoes.Opcao3;
        opcao4 = questoes.Opcao4;
        opcao5 = questoes.Opcao5;
        opcao6 = questoes.Opcao6;
        opcao7 = questoes.Opcao7;
        opcao8 = questoes.Opcao8;
        opcao9 = questoes.Opcao9;
        opcao10 = questoes.Opcao10;
        derivadaDeId = questoes.DerivadaDeId;
        derivadaDeOpcao = questoes.DerivadaDeOpcao;
}
}
