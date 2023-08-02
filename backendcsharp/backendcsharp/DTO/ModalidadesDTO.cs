namespace backendcsharp.DTO
{
    public class ModalidadesDTO
    {
        public uint? Id { get; set; }
        public uint? ResponsavelId { get; set; } = null!;
        public string? Modalidade { get; set; } = null!;
        public virtual UsersDTO? Responsavel { get; set; } = null!;
    }
}
