namespace backendcsharp.DTO;

public partial class FormularioDTO
{
    public uint? id { get; set; } = null!;

    public string? titulo { get; set; } = null!;

    public uint? responsavelId { get; set; } = null!;

    public virtual ICollection<EnviadoDTO> enviados { get; } = new List<EnviadoDTO>();

    public virtual ICollection<QuestoesDTO> questoes { get; } = new List<QuestoesDTO>();

    public virtual UsersDTO? responsavel { get; set; } = null!;
}
