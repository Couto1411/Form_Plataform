namespace backendcsharp.DTO
{
    public class CursosDTO
    {
        public uint? Id { get; set; }
        public uint? ResponsavelId { get; set; } = null!;
        public string? Curso { get; set; } = null!;
        public virtual UsersDTO? Responsavel { get; set; } = null!;
    }
}
