using backendcsharp.Entities;

namespace backendcsharp.DTO;

public partial class DestinatarioDTO
{
    public uint? id { get; set; } = null!;

    public uint? formId { get; set; } = null!;

    public short respondido { get; set; } = 0;

    public string? nome { get; set; } = null!;
    public string? email { get; set; } = null!;
    public string? telefone1 { get; set; } = null!;
    public string? telefone2 { get; set; } = null!;
    public string? matricula { get; set; } = null!;
    public string? cpf { get; set; } = null!;
    public string? sexo { get; set; } = null!;
    public string? curso { get; set; } = null!;
    public string? modalidade { get; set; } = null!;
    public DateTime? dataColacao { get; set; } = null!;

    public virtual ICollection<CheckboxDTO> checkboxes { get; } = new List<CheckboxDTO>();

    public virtual FormularioDTO? form { get; set; } = null!;

    public virtual ICollection<RadioboxDTO> radioboxes { get; } = new List<RadioboxDTO>();

    public virtual ICollection<TextDTO> texts { get; } = new List<TextDTO>();

    public DestinatarioDTO() { }

    public DestinatarioDTO(Destinatario envio) : this()
    {
        id = envio.Id;
        nome = envio.Nome;
        formId = envio.FormId;
        respondido = envio.Respondido;
        email = envio.Email;
        telefone1 = envio.Telefone1;
        telefone2 = envio.Telefone2;
        matricula = envio.Matricula;
        cpf = envio.Cpf;
        sexo = envio.Sexo;
        curso = envio.Curso;
        modalidade = envio.Modalidade;
        dataColacao = envio.DataColacao;
    }
}
