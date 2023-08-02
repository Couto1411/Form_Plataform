namespace backendcsharp.DTO;

public partial class RadioboxDTO
{
    public uint? Id { get; set; } = null!;

    public uint? QuestaoId { get; set; } = null!;

    public uint? RespostaId { get; set; } = null!;

    public int? Radio { get; set; } = null!;

    public virtual QuestoesDTO Questao { get; set; } = null!;

    public virtual DestinatarioDTO Resposta { get; set; } = null!;
}
