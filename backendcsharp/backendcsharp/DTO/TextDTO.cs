namespace backendcsharp.DTO;

public partial class TextDTO
{
    public uint? id { get; set; } = null!;

    public uint? questaoId { get; set; } = null!;

    public uint? respostaId { get; set; } = null!;

    public string? texto { get; set; } = null!;

    public virtual QuestoesDTO questao { get; set; } = null!;

    public virtual EnviadoDTO resposta { get; set; } = null!;
}
