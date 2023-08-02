using backendcsharp.Entities;

namespace backendcsharp.DTO;

public partial class DestinatarioDTO
{
    public uint? Id { get; set; } = null!;

    public uint? FormId { get; set; } = null!;

    public short Respondido { get; set; } = 0;

    public string? Nome { get; set; } = null!;
    public string? Email { get; set; } = null!;
    public string? Telefone1 { get; set; } = null!;
    public string? Telefone2 { get; set; } = null!;
    public string? Matricula { get; set; } = null!;
    public string? Cpf { get; set; } = null!;
    public string? Sexo { get; set; } = null!;
    public string? Curso { get; set; } = null!;
    public string? Modalidade { get; set; } = null!;
    public DateTime? DataColacao { get; set; } = null!;

    public virtual ICollection<CheckboxDTO> Checkboxes { get; } = new List<CheckboxDTO>();

    public virtual FormularioDTO? Form { get; set; } = null!;

    public virtual ICollection<RadioboxDTO> Radioboxes { get; } = new List<RadioboxDTO>();

    public virtual ICollection<TextDTO> Texts { get; } = new List<TextDTO>();

    public DestinatarioDTO() { }

    public DestinatarioDTO(Destinatario? envio) : this()
    {
        if (envio is not null)
        {
            Id = envio.Id;
            Nome = envio.Nome;
            FormId = envio.FormId;
            Respondido = envio.Respondido;
            Email = envio.Email;
            Telefone1 = envio.Telefone1;
            Telefone2 = envio.Telefone2;
            Matricula = envio.Matricula;
            Cpf = envio.Cpf;
            Sexo = envio.Sexo;
            Curso = envio.Curso;
            Modalidade = envio.Modalidade;
            DataColacao = envio.DataColacao;
        }
    }
}
