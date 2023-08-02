namespace backendcsharp.DTO;

public partial class FormularioDTO
{
    public uint? Id { get; set; } = null!;

    public string? Titulo { get; set; } = null!;

    public uint? ResponsavelId { get; set; } = null!;
    public uint? DerivadoDeId { get; set; } = null!;
    public DateTime? DataEnviado { get; set; } = null!;
    public string? MsgEmail { get; set; } = null!;

    public virtual ICollection<FormularioDTO> Derivados { get; set; } = new List<FormularioDTO>();

    public virtual ICollection<DestinatarioDTO> Enviados { get; } = new List<DestinatarioDTO>();

    public virtual ICollection<QuestoesDTO> Questoes { get; set; } = new List<QuestoesDTO>();

    public virtual FormularioDTO? FormularioOrig { get; set; } = null!;

    public virtual UsersDTO? Responsavel { get; set; } = null!;
}
