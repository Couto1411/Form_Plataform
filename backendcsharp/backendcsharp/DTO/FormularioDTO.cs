namespace backendcsharp.DTO;

public partial class FormularioDTO
{
    public uint? id { get; set; } = null!;

    public string? titulo { get; set; } = null!;

    public uint? responsavelId { get; set; } = null!;
    public uint? derivadoDeId { get; set; } = null!;
    public DateTime? dataEnviado { get; set; } = null!;
    public string? msgEmail { get; set; } = null!;

    public virtual ICollection<FormularioDTO> derivados { get; set; } = new List<FormularioDTO>();

    public virtual ICollection<DestinatarioDTO> enviados { get; } = new List<DestinatarioDTO>();

    public virtual ICollection<QuestoesDTO> questoes { get; set; } = new List<QuestoesDTO>();

    public virtual FormularioDTO? formularioOrig { get; set; } = null!;

    public virtual UsersDTO? responsavel { get; set; } = null!;
}
