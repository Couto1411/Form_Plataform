namespace backendcsharp.DTO
{
    public class ModalidadesDTO
    {
        public uint? id { get; set; }
        public uint? responsavelId { get; set; } = null!;
        public string? modalidade { get; set; } = null!;
        public virtual UsersDTO? responsavel { get; set; } = null!;
    }
}
