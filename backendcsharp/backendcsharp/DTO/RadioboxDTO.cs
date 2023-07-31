namespace backendcsharp.DTO;

public partial class RadioboxDTO
{
    public uint? id { get; set; } = null!;

    public uint? questaoId { get; set; } = null!;

    public uint? respostaId { get; set; } = null!;

    public int? radio { get; set; } = null!;

    public virtual QuestoesDTO questao { get; set; } = null!;

    public virtual DestinatarioDTO resposta { get; set; } = null!;
}
