namespace backendcsharp.DTO;

public partial class TextDTO
{
    public uint? Id { get; set; } = null!;

    public uint? QuestaoId { get; set; } = null!;

    public uint? RespostaId { get; set; } = null!;

    public string? Texto { get; set; } = null!;

    public virtual QuestoesDTO Questao { get; set; } = null!;

    public virtual DestinatarioDTO Resposta { get; set; } = null!;
}
